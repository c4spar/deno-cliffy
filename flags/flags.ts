import {
  getDefaultValue,
  getOption,
  matchWildCardOptions,
  paramCaseToCamelCase,
} from "./_utils.ts";
import {
  DuplicateOptionError,
  InvalidOptionError,
  InvalidOptionValueError,
  MissingOptionValueError,
  UnexpectedArgumentAfterVariadicArgumentError,
  UnexpectedOptionValueError,
  UnexpectedRequiredArgumentError,
  UnknownConflictingOptionError,
  UnknownOptionError,
  UnknownRequiredOptionError,
  UnknownTypeError,
} from "./_errors.ts";
import { OptionType } from "./deprecated.ts";
import type {
  ArgumentOptions,
  ArgumentType,
  FlagOptions,
  ParseFlagsContext,
  ParseFlagsOptions,
  TypeHandler,
} from "./types.ts";
import { boolean } from "./types/boolean.ts";
import { number } from "./types/number.ts";
import { string } from "./types/string.ts";
import { validateFlags } from "./_validate_flags.ts";
import { integer } from "./types/integer.ts";

const DefaultTypes: Record<ArgumentType, TypeHandler> = {
  string,
  number,
  integer,
  boolean,
};

/**
 * Parse command line arguments.
 * @param argsOrCtx Command line arguments e.g: `Deno.args` or parse context.
 * @param opts      Parse options.
 *
 * ```
 * // example.ts -x 3 -y.z -n5 -abc --beep=boop foo bar baz --deno.land -- --cliffy
 * parseFlags(Deno.args);
 * ```
 * ```
 * {
 *   flags: {
 *     x: "3",
 *     y: { z: true },
 *     n: "5",
 *     a: true,
 *     b: true,
 *     c: true,
 *     beep: "boop",
 *     deno: { land: true }
 *   },
 *   unknown: [ "foo", "bar", "baz" ],
 *   literal: [ "--cliffy" ]
 * }
 * ```
 */
export function parseFlags<
  TFlags extends Record<string, unknown>,
  TFlagOptions extends FlagOptions,
  TFlagsResult extends ParseFlagsContext,
>(
  argsOrCtx: string[] | TFlagsResult,
  opts: ParseFlagsOptions<TFlagOptions> = {},
): TFlagsResult & ParseFlagsContext<TFlags, TFlagOptions> {
  let args: Array<string>;
  let ctx: ParseFlagsContext<Record<string, unknown>>;

  if (Array.isArray(argsOrCtx)) {
    ctx = {} as ParseFlagsContext<Record<string, unknown>>;
    args = argsOrCtx;
  } else {
    ctx = argsOrCtx;
    args = argsOrCtx.unknown;
    argsOrCtx.unknown = [];
  }
  args = args.slice();

  ctx.flags ??= {};
  ctx.literal ??= [];
  ctx.unknown ??= [];
  ctx.stopEarly = false;
  ctx.stopOnUnknown = false;

  opts.dotted ??= true;

  validateOptions(opts);
  const options = parseArgs(ctx, args, opts);
  validateFlags(ctx, opts, options);

  if (opts.dotted) {
    parseDottedOptions(ctx);
  }

  return ctx as TFlagsResult & ParseFlagsContext<TFlags, TFlagOptions>;
}

function validateOptions<TFlagOptions extends FlagOptions>(
  opts: ParseFlagsOptions<TFlagOptions>,
) {
  opts.flags?.forEach((opt) => {
    opt.depends?.forEach((flag) => {
      if (!opts.flags || !getOption(opts.flags, flag)) {
        throw new UnknownRequiredOptionError(flag, opts.flags ?? []);
      }
    });
    opt.conflicts?.forEach((flag) => {
      if (!opts.flags || !getOption(opts.flags, flag)) {
        throw new UnknownConflictingOptionError(flag, opts.flags ?? []);
      }
    });
  });
}

function parseArgs<TFlagOptions extends FlagOptions>(
  ctx: ParseFlagsContext<Record<string, unknown>>,
  args: Array<string>,
  opts: ParseFlagsOptions<TFlagOptions>,
): Map<string, FlagOptions> {
  /** Option name mapping: propertyName -> option.name */
  const optionsMap: Map<string, FlagOptions> = new Map();
  let inLiteral = false;

  for (
    let argsIndex = 0;
    argsIndex < args.length;
    argsIndex++
  ) {
    let option: FlagOptions | undefined;
    let optionArgs: ArgumentOptions[] | undefined;
    let current: string = args[argsIndex];
    let currentValue: string | undefined;
    let negate = false;

    // literal args after --
    if (inLiteral) {
      ctx.literal.push(current);
      continue;
    } else if (current === "--") {
      inLiteral = true;
      continue;
    } else if (ctx.stopEarly || ctx.stopOnUnknown) {
      ctx.unknown.push(current);
      continue;
    }

    const isFlag = current.length > 1 && current[0] === "-";

    if (!isFlag) {
      if (opts.stopEarly) {
        ctx.stopEarly = true;
      }
      ctx.unknown.push(current);
      continue;
    }
    const isShort = current[1] !== "-";
    const isLong = isShort ? false : current.length > 3 && current[2] !== "-";

    if (!isShort && !isLong) {
      throw new InvalidOptionError(current, opts.flags ?? []);
    }

    // normalize short flags: -abc => -a -b -c
    if (isShort && current.length > 2 && current[2] !== ".") {
      args.splice(argsIndex, 1, ...splitFlags(current));
      current = args[argsIndex];
    } else if (isLong && current.startsWith("--no-")) {
      negate = true;
    }

    // split value: --foo="bar=baz" => --foo bar=baz
    const equalSignIndex = current.indexOf("=");
    if (equalSignIndex !== -1) {
      currentValue = current.slice(equalSignIndex + 1) || undefined;
      current = current.slice(0, equalSignIndex);
    }
    option = opts.flags && getOption(opts.flags, current);

    if (!option) {
      if (opts.flags?.length) {
        const name = current.replace(/^-+/, "");
        option = matchWildCardOptions(name, opts.flags);
        if (!option) {
          if (opts.stopOnUnknown) {
            ctx.stopOnUnknown = true;
            ctx.unknown.push(args[argsIndex]);
            continue;
          }
          throw new UnknownOptionError(current, opts.flags);
        }
      }
      if (!option) {
        option = {
          name: current.replace(/^-+/, ""),
          optionalValue: true,
          type: OptionType.STRING,
        };
      }
    }

    if (option.standalone) {
      ctx.standalone = option;
    }

    const positiveName: string = negate
      ? option.name.replace(/^no-?/, "")
      : option.name;
    const propName: string = paramCaseToCamelCase(positiveName);

    if (typeof ctx.flags[propName] !== "undefined") {
      if (!opts.flags?.length) {
        option.collect = true;
      } else if (!option.collect) {
        throw new DuplicateOptionError(current);
      }
    }

    optionArgs = option.args?.length ? option.args : [{
      type: option.type,
      requiredValue: option.requiredValue,
      optionalValue: option.optionalValue,
      variadic: option.variadic,
      list: option.list,
      separator: option.separator,
    }];

    if (
      opts.flags?.length && !option.args?.length && !option.type &&
      typeof currentValue !== "undefined"
    ) {
      throw new UnexpectedOptionValueError(option.name, currentValue);
    }

    let optionArgsIndex = 0;
    let inOptionalArg = false;
    const next = () => currentValue ?? args[argsIndex + 1];
    const previous = ctx.flags[propName];

    parseNext(option, optionArgs);

    if (typeof ctx.flags[propName] === "undefined") {
      if (optionArgs[optionArgsIndex].requiredValue) {
        throw new MissingOptionValueError(option.name);
      } else if (typeof option.default !== "undefined") {
        ctx.flags[propName] = getDefaultValue(option);
      } else {
        ctx.flags[propName] = true;
      }
    }

    if (option.value) {
      ctx.flags[propName] = option.value(ctx.flags[propName], previous);
    } else if (option.collect) {
      const value: unknown[] = typeof previous !== "undefined"
        ? (Array.isArray(previous) ? previous : [previous])
        : [];

      value.push(ctx.flags[propName]);
      ctx.flags[propName] = value;
    }

    optionsMap.set(propName, option);

    opts.option?.(option as TFlagOptions, ctx.flags[propName]);

    /** Parse next argument for current option. */
    // deno-lint-ignore no-inner-declarations
    function parseNext(
      option: FlagOptions,
      optionArgs: ArgumentOptions[],
    ): void {
      const arg: ArgumentOptions | undefined = optionArgs[optionArgsIndex];

      if (!arg) {
        const flag = next();
        throw new UnknownOptionError(flag, opts.flags ?? []);
      }

      if (!arg.type) {
        arg.type = OptionType.BOOLEAN;
      }

      if (option.args?.length) {
        // make all values required by default
        if (
          (typeof arg.optionalValue === "undefined" ||
            arg.optionalValue === false) &&
          typeof arg.requiredValue === "undefined"
        ) {
          arg.requiredValue = true;
        }
      } else {
        // make non boolean value required by default
        if (
          arg.type !== OptionType.BOOLEAN &&
          (typeof arg.optionalValue === "undefined" ||
            arg.optionalValue === false) &&
          typeof arg.requiredValue === "undefined"
        ) {
          arg.requiredValue = true;
        }
      }

      if (arg.requiredValue) {
        if (inOptionalArg) {
          throw new UnexpectedRequiredArgumentError(option.name);
        }
      } else {
        inOptionalArg = true;
      }

      if (negate) {
        ctx.flags[propName] = false;
        return;
      }

      let result: unknown;
      let increase = false;

      if (arg.list && hasNext(arg)) {
        const parsed: unknown[] = next()
          .split(arg.separator || ",")
          .map((nextValue: string) => {
            const value = parseValue(option, arg, nextValue);
            if (typeof value === "undefined") {
              throw new InvalidOptionValueError(
                option.name,
                arg.type ?? "?",
                nextValue,
              );
            }
            return value;
          });

        if (parsed?.length) {
          result = parsed;
        }
      } else {
        if (hasNext(arg)) {
          result = parseValue(option, arg, next());
        } else if (arg.optionalValue && arg.type === OptionType.BOOLEAN) {
          result = true;
        }
      }

      if (increase && typeof currentValue === "undefined") {
        argsIndex++;
        if (!arg.variadic) {
          optionArgsIndex++;
        } else if (optionArgs[optionArgsIndex + 1]) {
          throw new UnexpectedArgumentAfterVariadicArgumentError(next());
        }
      }

      if (
        typeof result !== "undefined" &&
        (optionArgs.length > 1 || arg.variadic)
      ) {
        if (!ctx.flags[propName]) {
          ctx.flags[propName] = [];
        }

        (ctx.flags[propName] as Array<unknown>).push(result);

        if (hasNext(arg)) {
          parseNext(option, optionArgs);
        }
      } else {
        ctx.flags[propName] = result;
      }

      /** Check if current option should have an argument. */
      function hasNext(arg: ArgumentOptions): boolean {
        const nextValue = currentValue ?? args[argsIndex + 1];
        if (!nextValue) {
          return false;
        }
        if (optionArgs.length > 1 && optionArgsIndex >= optionArgs.length) {
          return false;
        }
        if (arg.requiredValue) {
          return true;
        }
        // require optional values to be called with an equal sign: foo=bar
        if (
          option.equalsSign && arg.optionalValue && !arg.variadic &&
          typeof currentValue === "undefined"
        ) {
          return false;
        }
        if (arg.optionalValue || arg.variadic) {
          return nextValue[0] !== "-" ||
            typeof currentValue !== "undefined" ||
            (arg.type === OptionType.NUMBER && !isNaN(Number(nextValue)));
        }

        return false;
      }

      /** Parse argument value.  */
      function parseValue(
        option: FlagOptions,
        arg: ArgumentOptions,
        value: string,
      ): unknown {
        const result: unknown = opts.parse
          ? opts.parse({
            label: "Option",
            type: arg.type || OptionType.STRING,
            name: `--${option.name}`,
            value,
          })
          : parseDefaultType(option, arg, value);

        if (
          typeof result !== "undefined"
        ) {
          increase = true;
        }

        return result;
      }
    }
  }

  return optionsMap;
}

function parseDottedOptions(ctx: ParseFlagsContext): void {
  // convert dotted option keys into nested objects
  ctx.flags = Object.keys(ctx.flags).reduce(
    (result: Record<string, unknown>, key: string) => {
      if (~key.indexOf(".")) {
        key.split(".").reduce(
          (
            // deno-lint-ignore no-explicit-any
            result: Record<string, any>,
            subKey: string,
            index: number,
            parts: string[],
          ) => {
            if (index === parts.length - 1) {
              result[subKey] = ctx.flags[key];
            } else {
              result[subKey] = result[subKey] ?? {};
            }
            return result[subKey];
          },
          result,
        );
      } else {
        result[key] = ctx.flags[key];
      }
      return result;
    },
    {},
  );
}

function splitFlags(flag: string): Array<string> {
  flag = flag.slice(1);
  const normalized: Array<string> = [];
  const index = flag.indexOf("=");
  const flags = (index !== -1 ? flag.slice(0, index) : flag).split("");

  if (isNaN(Number(flag[flag.length - 1]))) {
    flags.forEach((val) => normalized.push(`-${val}`));
  } else {
    normalized.push(`-${flags.shift()}`);
    if (flags.length) {
      normalized.push(flags.join(""));
    }
  }

  if (index !== -1) {
    normalized[normalized.length - 1] += flag.slice(index);
  }

  return normalized;
}

function parseDefaultType(
  option: FlagOptions,
  arg: ArgumentOptions,
  value: string,
): unknown {
  const type: ArgumentType = arg.type as ArgumentType || OptionType.STRING;
  const parseType = DefaultTypes[type];

  if (!parseType) {
    throw new UnknownTypeError(type, Object.keys(DefaultTypes));
  }

  return parseType({
    label: "Option",
    type,
    name: `--${option.name}`,
    value,
  });
}
