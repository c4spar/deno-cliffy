import { getDefaultValue, getOption, paramCaseToCamelCase } from "./_utils.ts";
import {
  ArgumentFollowsVariadicArgument,
  DuplicateOption,
  InvalidOption,
  InvalidOptionValue,
  MissingOptionValue,
  RequiredArgumentFollowsOptionalArgument,
  UnknownConflictingOption,
  UnknownOption,
  UnknownRequiredOption,
  UnknownType,
} from "./_errors.ts";
import type {
  IFlagArgument,
  IFlagOptions,
  IFlagsResult,
  IParseOptions,
  ITypeHandler,
} from "./types.ts";
import { OptionType } from "./types.ts";
import { boolean } from "./types/boolean.ts";
import { number } from "./types/number.ts";
import { string } from "./types/string.ts";
import { validateFlags } from "./validate_flags.ts";
import { integer } from "./types/integer.ts";

const Types: Record<string, ITypeHandler<unknown>> = {
  [OptionType.STRING]: string,
  [OptionType.NUMBER]: number,
  [OptionType.INTEGER]: integer,
  [OptionType.BOOLEAN]: boolean,
};

/**
 * Parse command line arguments.
 * @param args  Command line arguments e.g: `Deno.args`
 * @param opts  Parse options.
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
// deno-lint-ignore no-explicit-any
export function parseFlags<O extends Record<string, any> = Record<string, any>>(
  args: string[],
  opts: IParseOptions = {},
): IFlagsResult<O> {
  !opts.flags && (opts.flags = []);
  let normalized: Array<string> = args.slice();

  let inLiteral = false;
  let negate = false;

  const flags: Record<string, unknown> = {};
  const optionNames: Record<string, string> = {};
  let literal: string[] = [];
  let unknown: string[] = [];
  let stopEarly: string | null = null;

  opts.flags.forEach((opt) => {
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

  for (
    let normalizedIndex = 0;
    normalizedIndex < normalized.length;
    normalizedIndex++
  ) {
    let option: IFlagOptions | undefined;
    let args: IFlagArgument[] | undefined;
    let current: string = normalized[normalizedIndex];
    let currentValue: string | undefined;

    // literal args after --
    if (inLiteral) {
      literal.push(current);
      continue;
    }

    if (current === "--") {
      inLiteral = true;
      continue;
    }

    const isFlag = current.length > 1 && current[0] === "-";
    const next = () => currentValue ?? normalized[normalizedIndex + 1];

    if (isFlag) {
      const isShort = current[1] !== "-";
      const isLong = isShort ? false : current.length > 3 && current[2] !== "-";

      if (!isShort && !isLong) {
        throw new InvalidOption(current, opts.flags);
      }

      // split value: --foo="bar=baz" => --foo bar=baz 
      const equalSignIndex = current.indexOf("=");
      if (equalSignIndex > -1) {
        currentValue = current.slice(equalSignIndex + 1) || undefined;
        current = current.slice(0, equalSignIndex);
      }

      // normalize short flags: -abc => -a -b -c
      if (isShort && current.length > 2 && current[2] !== ".") {
        normalized.splice(normalizedIndex, 1, ...splitFlags(current));
        current = normalized[normalizedIndex];
      } else if (isLong && current.startsWith("--no-")) {
        negate = true;
      }

      option = getOption(opts.flags, current);

      if (!option) {
        if (opts.flags.length) {
          throw new UnknownOption(current, opts.flags);
        }

        option = {
          name: current.replace(/^-+/, ""),
          optionalValue: true,
          type: OptionType.STRING,
        };
      }

      const positiveName: string = negate
        ? option.name.replace(/^no-?/, "")
        : option.name;
      const propName: string = paramCaseToCamelCase(positiveName);

      if (typeof flags[propName] !== "undefined") {
        if (!opts.flags.length) {
          option.collect = true;
        } else if (!option.collect) {
          throw new DuplicateOption(current);
        }
      }

      args = option.args?.length ? option.args : [{
        type: option.type,
        requiredValue: option.requiredValue,
        optionalValue: option.optionalValue,
        variadic: option.variadic,
        list: option.list,
        separator: option.separator,
      }];

      let argIndex = 0;
      let inOptionalArg = false;
      const previous = flags[propName];

      parseNext(option, args);

      if (typeof flags[propName] === "undefined") {
        if (args[argIndex].requiredValue) {
          throw new MissingOptionValue(option.name);
        } else if (typeof option.default !== "undefined") {
          flags[propName] = getDefaultValue(option);
        } else {
          flags[propName] = true;
        }
      }

      if (option.value) {
        flags[propName] = option.value(flags[propName], previous);
      } else if (option.collect) {
        const value: unknown[] = typeof previous !== "undefined"
          ? (Array.isArray(previous) ? previous : [previous])
          : [];

        value.push(flags[propName]);
        flags[propName] = value;
      }

      optionNames[propName] = option.name;

      opts.option?.(option, flags[propName]);

      /** Parse next argument for current option. */
      // deno-lint-ignore no-inner-declarations
      function parseNext(option: IFlagOptions, args: IFlagArgument[]): void {
        const arg: IFlagArgument = args[argIndex];

        if (!arg) {
          const flag = next();
          throw new UnknownOption(flag, opts.flags ?? []);
        }

        if (!arg.type) {
          arg.type = OptionType.BOOLEAN;
        }

        if (option.args?.length) {
          // make all value's required per default
          if (
            (typeof arg.optionalValue === "undefined" ||
              arg.optionalValue === false) &&
            typeof arg.requiredValue === "undefined"
          ) {
            arg.requiredValue = true;
          }
        } else {
          // make non boolean value required per default
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
            throw new RequiredArgumentFollowsOptionalArgument(option.name);
          }
        } else {
          inOptionalArg = true;
        }

        if (negate) {
          flags[propName] = false;
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
          } else if (arg.optionalValue && arg.type === OptionType.BOOLEAN) {
            result = true;
          }
        }

        if (increase && typeof currentValue === "undefined") {
          normalizedIndex++;
          if (!arg.variadic) {
            argIndex++;
          } else if (args[argIndex + 1]) {
            throw new ArgumentFollowsVariadicArgument(next());
          }
        }

        if (
          typeof result !== "undefined" && ((args.length > 1) || arg.variadic)
        ) {
          if (!flags[propName]) {
            flags[propName] = [];
          }

          (flags[propName] as Array<unknown>).push(result);

          if (hasNext(arg)) {
            parseNext(option, args);
          }
        } else {
          flags[propName] = result;
        }

        /** Check if current option should have an argument. */
        function hasNext(arg: IFlagArgument): boolean {
          const nextValue = currentValue ?? normalized[normalizedIndex + 1];
          if (!currentValue && !nextValue) {
            return false;
          }

          if (arg.requiredValue) {
            return true;
          }

          if (arg.optionalValue || arg.variadic) {
            return nextValue[0] !== "-" ||
              (arg.type === OptionType.NUMBER && !isNaN(Number(nextValue)));
          }

          return false;
        }

        /** Parse argument value.  */
        function parseValue(
          option: IFlagOptions,
          arg: IFlagArgument,
          value: string,
        ): unknown {
          const type: string = arg.type || OptionType.STRING;
          const result: unknown = opts.parse
            ? opts.parse({
              label: "Option",
              type,
              name: `--${option.name}`,
              value,
            })
            : parseFlagValue(option, arg, value);

          if (
            typeof result !== "undefined"
          ) {
            increase = true;
          }

          return result;
        }
      }
    } else {
      if (opts.stopEarly) {
        stopEarly = current;
        break;
      }
      unknown.push(current);
    }
  }

  if (stopEarly) {
    const stopEarlyArgIndex: number = args.indexOf(stopEarly);
    if (stopEarlyArgIndex !== -1) {
      const doubleDashIndex: number = args.indexOf("--");
      unknown = args.slice(
        stopEarlyArgIndex,
        doubleDashIndex === -1 ? undefined : doubleDashIndex,
      );
      if (doubleDashIndex !== -1) {
        literal = args.slice(doubleDashIndex + 1);
      }
    }
  }

  if (opts.flags?.length) {
    validateFlags(
      opts.flags,
      flags,
      opts.knownFlaks,
      opts.allowEmpty,
      optionNames,
    );
  }

  // convert dotted option keys into nested objects
  const result = Object.keys(flags)
    .reduce((result: Record<string, unknown>, key: string) => {
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
              result[subKey] = flags[key];
            } else {
              result[subKey] = result[subKey] ?? {};
            }
            return result[subKey];
          },
          result,
        );
      } else {
        result[key] = flags[key];
      }
      return result;
    }, {});

  return { flags: result as O, unknown, literal };
}

function splitFlags(flag: string): Array<string> {
  const normalized: Array<string> = [];
  const flags = flag.slice(1).split("");

  if (isNaN(Number(flag[flag.length - 1]))) {
    flags.forEach((val) => normalized.push(`-${val}`));
  } else {
    normalized.push(`-${flags.shift()}`);
    if (flags.length) {
      normalized.push(flags.join(""));
    }
  }

  return normalized;
}

function parseFlagValue(
  option: IFlagOptions,
  arg: IFlagArgument,
  value: string,
): unknown {
  const type: string = arg.type || OptionType.STRING;
  const parseType = Types[type];

  if (!parseType) {
    throw new UnknownType(type, Object.keys(Types));
  }

  return parseType({
    label: "Option",
    type,
    name: `--${option.name}`,
    value,
  });
}
