import {
  ArgumentFollowsVariadicArgument,
  DuplicateOption,
  InvalidOption,
  InvalidOptionValue,
  MissingOptionValue,
  RequiredArgumentFollowsOptionalArgument,
  UnexpectedOptionValue,
  UnknownConflictingOption,
  UnknownOption,
  UnknownRequiredOption,
  UnknownType,
} from "./_errors.ts";
import {
  getDefaultValue,
  getOption,
  isValueFlag,
  matchWildCardOptions,
  paramCaseToCamelCase,
} from "./_utils.ts";
import type {
  FlagArgumentType,
  FlagArgumentTypeHandler,
  ParseFlagsContext,
  ParseFlagsOptions,
  ValuesFlagOptions,
} from "./types.ts";
import { FlagArgument, FlagOptions, OptionType } from "./types.ts";
import { boolean } from "./types/boolean.ts";
import { integer } from "./types/integer.ts";
import { number } from "./types/number.ts";
import { string } from "./types/string.ts";
import { validateFlags } from "./validate_flags.ts";

type Id<T> = T extends Record<string, unknown>
  ? T extends infer U ? { [K in keyof U]: Id<U[K]> } : never
  : T;

type DefaultTypes = {
  [KType in FlagArgumentType]: FlagArgumentTypeHandler<KType, unknown>;
};

const DefaultTypes = { string, number, integer, boolean };

/**
 * Parse command line arguments.
 * @param argsOrCtx Command line arguments e.g: `Deno.args` or parse context.
 * @param opts      Parse options.
 *
 * ```
 * // examples/flags/flags.ts -x 3 -y.z -n5 -abc --beep=boop foo bar baz --deno.land --deno.com -- --cliffy
 * parseFlags(Deno.args);
 * ```
 *
 * Output:
 *
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
 *     deno: { land: true, com: true }
 *   },
 *   literal: [ "--cliffy" ],
 *   unknown: [ "foo", "bar", "baz" ],
 *   stopEarly: false,
 *   stopOnUnknown: false
 * }
 * ```
 */
export function parseFlags<
  TFlags extends Record<string, unknown>,
>(
  argsOrCtx:
    | Array<string>
    | ParseFlagsContext<
      FlagArgumentType,
      TFlags,
      FlagOptions<FlagArgumentType>
    >,
  opts?: ParseFlagsOptions<FlagArgumentType>,
): Id<
  ParseFlagsContext<
    FlagArgumentType,
    TFlags & Record<string, unknown>,
    FlagOptions<FlagArgumentType>
  >
>;

export function parseFlags<
  TType extends string,
  TFlagOptions extends FlagOptions<TType>,
  TFlags extends Record<string, unknown>,
>(
  argsOrCtx:
    | Array<string>
    | ParseFlagsContext<
      TType,
      TFlags,
      TFlagOptions
    >,
  opts: ParseFlagsOptions<TType, TFlagOptions>,
  parse: FlagArgumentTypeHandler<TType, unknown>,
): Id<
  ParseFlagsContext<
    TType,
    TFlags & Record<string, unknown>,
    TFlagOptions
  >
>;

export function parseFlags<
  TType extends string,
>(
  argsOrCtx:
    | Array<string>
    | ParseFlagsContext<
      TType,
      Record<string, unknown>,
      FlagOptions<TType>
    >,
  opts: ParseFlagsOptions<TType> = {},
  parse?: FlagArgumentTypeHandler<TType, unknown>,
): Id<
  ParseFlagsContext<
    TType,
    Record<string, unknown>,
    FlagOptions<TType>
  >
> {
  let args: Array<string>;
  let ctx: ParseFlagsContext<
    TType,
    Record<string, unknown>,
    FlagOptions<TType>
  >;

  if (Array.isArray(argsOrCtx)) {
    ctx = {} as ParseFlagsContext<
      TType,
      Record<string, unknown>,
      FlagOptions<TType>
    >;
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
  const options = parseArgs(ctx, args, opts, parse);
  validateFlags(ctx, opts, options);

  if (opts.dotted) {
    parseDottedOptions(ctx);
  }

  return ctx;
}

function validateOptions<TType extends string>(opts: ParseFlagsOptions<TType>) {
  opts.flags?.forEach((opt) => {
    opt.depends?.forEach((flag) => {
      if (!opts.flags || !getOption(opts.flags, flag)) {
        throw new UnknownRequiredOption(flag, opts.flags ?? []);
      }
    });
    opt.conflicts?.forEach((flag) => {
      if (!opts.flags || !getOption(opts.flags, flag)) {
        throw new UnknownConflictingOption(flag, opts.flags ?? []);
      }
    });
  });
}

function parseArgs<TType extends string>(
  ctx: ParseFlagsContext<
    TType,
    Record<string, unknown>,
    FlagOptions<TType>
  >,
  args: Array<string>,
  opts: ParseFlagsOptions<TType>,
  parseCustomType?: FlagArgumentTypeHandler<TType, unknown>,
): Map<string, FlagOptions<TType>> {
  /** Option name mapping: propertyName -> option.name */
  const optionsMap: Map<string, FlagOptions<TType>> = new Map();
  let inLiteral = false;

  for (
    let argsIndex = 0;
    argsIndex < args.length;
    argsIndex++
  ) {
    let option: FlagOptions<TType> | undefined;
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
      throw new InvalidOption(current, opts.flags ?? []);
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

    if (opts.flags) {
      option = getOption(opts.flags, current);

      if (!option) {
        const name = current.replace(/^-+/, "");
        option = matchWildCardOptions(name, opts.flags);

        if (!option) {
          if (opts.stopOnUnknown) {
            ctx.stopOnUnknown = true;
            ctx.unknown.push(args[argsIndex]);
            continue;
          }
          throw new UnknownOption(current, opts.flags);
        }
      }
    } else {
      option = {
        name: current.replace(/^-+/, ""),
        optionalValue: true,
        type: "string" as TType,
      };
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
        throw new DuplicateOption(current);
      }
    }

    if ("type" in option && option.type && !isValueFlag(option)) {
      (option as unknown as ValuesFlagOptions<TType>).args = [{
        type: option.type,
        optional: option.optionalValue,
        variadic: option.variadic,
        list: option.list,
        separator: option.separator,
      }];
    }

    if (
      opts.flags?.length && !isValueFlag(option) &&
      typeof currentValue !== "undefined"
    ) {
      throw new UnexpectedOptionValue(option.name, currentValue);
    }

    let optionArgsIndex = 0;
    let inOptionalArg = false;
    const next = () => currentValue ?? args[argsIndex + 1];
    const previous = ctx.flags[propName];

    parseNext(option);

    if (typeof ctx.flags[propName] === "undefined") {
      if (isValueFlag(option) && !option.args[optionArgsIndex].optional) {
        throw new MissingOptionValue(option.name);
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

    opts.option?.(option, ctx.flags[propName]);

    /** Parse next argument for current option. */
    // deno-lint-ignore no-inner-declarations
    function parseNext(
      option: FlagOptions<TType>,
    ): void {
      if (negate) {
        ctx.flags[propName] = false;
        return;
      } else if (!isValueFlag(option)) {
        ctx.flags[propName] = undefined;
        return;
      }
      const arg: FlagArgument<TType> | undefined = option.args[optionArgsIndex];

      if (!arg) {
        const flag = next();
        throw new UnknownOption(flag, opts.flags ?? []);
      }

      if (arg.optional) {
        inOptionalArg = true;
      } else if (inOptionalArg) {
        throw new RequiredArgumentFollowsOptionalArgument(option.name);
      }

      let result: unknown;
      let increase = false;

      if (arg.list && hasNext(arg)) {
        const parsed: unknown[] = next()
          .split(arg.separator || ",")
          .map((nextValue: string) => {
            const value = parseValue(option, arg, nextValue);
            if (typeof value === "undefined") {
              throw new InvalidOptionValue(
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
        } else if (arg.optional && arg.type === OptionType.BOOLEAN) {
          result = true;
        }
      }

      if (increase && typeof currentValue === "undefined") {
        argsIndex++;
        if (!arg.variadic) {
          optionArgsIndex++;
        } else if (option.args[optionArgsIndex + 1]) {
          throw new ArgumentFollowsVariadicArgument(next());
        }
      }

      if (
        typeof result !== "undefined" &&
        (option.args.length > 1 || arg.variadic)
      ) {
        if (!ctx.flags[propName]) {
          ctx.flags[propName] = [];
        }
        (ctx.flags[propName] as Array<unknown>).push(result);

        if (hasNext(arg)) {
          parseNext(option);
        }
      } else {
        ctx.flags[propName] = result;
      }

      /** Check if current option should have an argument. */
      function hasNext(arg: FlagArgument<TType>): boolean {
        if (!isValueFlag(option)) {
          return false;
        }
        const nextValue = currentValue ?? args[argsIndex + 1];
        if (
          !nextValue ||
          option.args.length > 1 && optionArgsIndex >= option.args.length
        ) {
          return false;
        }
        if (!arg.optional) {
          return true;
        }
        // require optional values to be called with an equal sign: foo=bar
        if (
          option.equalsSign && arg.optional && !arg.variadic &&
          typeof currentValue === "undefined"
        ) {
          return false;
        }
        if (arg.optional || arg.variadic) {
          return nextValue[0] !== "-" ||
            (arg.type === OptionType.NUMBER && !isNaN(Number(nextValue)));
        }

        return false;
      }

      /** Parse argument value.  */
      function parseValue(
        option: ValuesFlagOptions<TType>,
        arg: FlagArgument<TType>,
        value: string,
      ): unknown {
        const result: unknown = parseCustomType
          ? parseCustomType({
            label: "Option",
            type: arg.type,
            name: `--${option.name}`,
            value,
          })
          : parseDefaultType(
            option as ValuesFlagOptions<FlagArgumentType>,
            arg as FlagArgument<FlagArgumentType>,
            value,
          );

        if (typeof result !== "undefined") {
          increase = true;
        }

        return result;
      }
    }
  }

  return optionsMap;
}

function parseDottedOptions<TType extends string>(
  ctx: ParseFlagsContext<
    TType,
    Record<string, unknown>,
    FlagOptions<TType>
  >,
): void {
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
  option: ValuesFlagOptions<FlagArgumentType>,
  arg: FlagArgument<FlagArgumentType>,
  value: string,
): unknown {
  const type: FlagArgumentType = arg.type || "string";
  const parseType = DefaultTypes[type] as FlagArgumentTypeHandler<
    FlagArgumentType,
    unknown
  >;

  if (!parseType) {
    throw new UnknownType(type, Object.keys(DefaultTypes));
  }

  return parseType({
    label: "Option",
    type,
    name: `--${option.name}`,
    value,
  });
}
