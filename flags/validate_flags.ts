import { paramCaseToCamelCase } from "./_utils.ts";
import { getOption } from "./flags.ts";
import type { IFlagArgument, IFlagOptions } from "./types.ts";

// @TODO: add support for knownFlaks

interface IFlagOptionsMap {
  name: string;
  option?: IFlagOptions;
}

/**
 * Validate flags.
 *
 * @param flags         Available flag options.
 * @param values        Flag to validate.
 * @param knownFlaks    Don't throw an error if a missing flag is defined in knownFlags (currently not implemented).
 * @param allowEmpty    Don't throw an error if values is empty.
 * @param optionNames   Mapped option names of negatable options.
 */
export function validateFlags(
  flags: IFlagOptions[],
  values: Record<string, unknown>,
  knownFlaks?: Record<string, unknown>,
  allowEmpty?: boolean,
  optionNames: Record<string, string> = {},
): void {
  const defaultValues: Record<string, boolean> = {};

  // Set default value's
  for (const option of flags) {
    let name: string | undefined;
    let defaultValue: unknown = undefined;

    // if --no-[flag] is present set --[flag] default value to true
    if (option.name.startsWith("no-")) {
      const propName = option.name.replace(/^no-/, "");
      if (propName in values) {
        continue;
      }
      const positiveOption = getOption(flags, propName);
      if (positiveOption) {
        continue;
      }
      name = paramCaseToCamelCase(propName);
      defaultValue = true;
    }

    if (!name) {
      name = paramCaseToCamelCase(option.name);
    }

    if (!(name in optionNames)) {
      optionNames[name] = option.name;
    }

    if (
      typeof values[name] === "undefined" &&
      (typeof option.default !== "undefined" ||
        typeof defaultValue !== "undefined")
    ) {
      values[name] = typeof option.default === "function"
        ? option.default()
        : (option.default ?? defaultValue);
      defaultValues[option.name] = true;
    }
  }

  const keys = Object.keys(values);

  if (keys.length === 0 && allowEmpty) {
    return;
  }

  const options: IFlagOptionsMap[] = keys.map((name) => ({
    name,
    option: getOption(flags, optionNames[name]),
  }));

  for (const { name, option } of options) {
    if (!option) {
      throw new Error("Unknown option: --" + name);
    }

    if (option.standalone) {
      if (keys.length > 1) {
        // don't throw an error if all values are coming from the default option.
        if (
          options.every(({ option: opt }) =>
            opt &&
            (option === opt || defaultValues[opt.name])
          )
        ) {
          return;
        }

        throw new Error(
          `Option --${option.name} cannot be combined with other options.`,
        );
      }
      return;
    }

    option.conflicts?.forEach((flag: string) => {
      if (isset(flag, values)) {
        throw new Error(
          `Option --${option.name} conflicts with option: --${flag}`,
        );
      }
    });

    option.depends?.forEach((flag: string) => {
      // don't throw an error if the value is coming from the default option.
      if (!isset(flag, values) && !defaultValues[option.name]) {
        throw new Error(`Option --${option.name} depends on option: --${flag}`);
      }
    });

    const isArray = (option.args?.length || 0) > 1;

    option.args?.forEach((arg: IFlagArgument, i: number) => {
      if (
        arg.requiredValue &&
        (
          typeof values[name] === "undefined" ||
          (isArray &&
            typeof (values[name] as Array<unknown>)[i] === "undefined")
        )
      ) {
        throw new Error(`Missing value for option: --${option.name}`);
      }
    });
  }

  for (const option of flags) {
    if (option.required && !(paramCaseToCamelCase(option.name) in values)) {
      if (
        (
          !option.conflicts ||
          !option.conflicts.find((flag: string) => !!values[flag])
        ) &&
        !options.find((opt) =>
          opt.option?.conflicts?.find((flag: string) => flag === option.name)
        )
      ) {
        throw new Error(`Missing required option: --${option.name}`);
      }
    }
  }

  if (keys.length === 0 && !allowEmpty) {
    throw new Error("No arguments.");
  }
}

function isset(flag: string, values: Record<string, unknown>): boolean {
  const name = paramCaseToCamelCase(flag);
  // return typeof values[ name ] !== 'undefined' && values[ name ] !== false;
  return typeof values[name] !== "undefined";
}
