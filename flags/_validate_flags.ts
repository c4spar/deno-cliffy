import {
  getDefaultValue,
  getOption,
  isValueFlag,
  paramCaseToCamelCase,
} from "./_utils.ts";
import {
  ConflictingOptionError,
  DependingOptionError,
  MissingOptionValueError,
  MissingRequiredOptionError,
  OptionNotCombinableError,
  UnknownOptionError,
} from "./_errors.ts";
import {
  ArgumentOptions,
  FlagOptions,
  ParseFlagsContext,
  ParseFlagsOptions,
} from "./types.ts";

/**
 * Flags post validation. Validations that are not already done by the parser.
 *
 * @param ctx     Parse context.
 * @param opts    Parse options.
 * @param options Option name mappings: propertyName -> option
 */
export function validateFlags<TType extends string>(
  ctx: ParseFlagsContext,
  opts: ParseFlagsOptions<TType>,
  options: Map<string, FlagOptions<TType>> = new Map(),
): void {
  if (!opts.flags) {
    return;
  }
  const defaultValues = setDefaultValues(ctx, opts);

  const optionNames = Object.keys(ctx.flags);
  if (!optionNames.length && opts.allowEmpty) {
    return;
  }

  if (ctx.standalone) {
    validateStandaloneOption(
      ctx,
      options,
      optionNames,
      defaultValues,
    );
    return;
  }

  for (const [name, option] of options) {
    validateUnknownOption(option, opts);
    validateConflictingOptions(ctx, option);
    validateDependingOptions(ctx, option, defaultValues);
    validateRequiredValues(ctx, option, name);
  }

  validateRequiredOptions(ctx, options, opts);
}

function validateUnknownOption<TType extends string>(
  option: FlagOptions<TType>,
  opts: ParseFlagsOptions<TType>,
) {
  if (!getOption(opts.flags ?? [], option.name)) {
    throw new UnknownOptionError(option.name, opts.flags ?? []);
  }
}

/**
 * Adds all default values to ctx.flags and returns a boolean object map with
 * only the default option names `{ [OptionName: string]: boolean }`.
 */
function setDefaultValues<TType extends string>(
  ctx: ParseFlagsContext,
  opts: ParseFlagsOptions<TType>,
) {
  const defaultValues: Record<string, boolean> = {};
  if (!opts.flags?.length) {
    return defaultValues;
  }

  // Set default values
  for (const option of opts.flags) {
    let name: string | undefined;
    let defaultValue: unknown = undefined;

    // if --no-[flag] is present set --[flag] default value to true
    if (option.name.startsWith("no-")) {
      const propName = option.name.replace(/^no-/, "");
      if (typeof ctx.flags[propName] !== "undefined") {
        continue;
      }
      const positiveOption = getOption(opts.flags, propName);
      if (positiveOption) {
        continue;
      }
      name = paramCaseToCamelCase(propName);
      defaultValue = true;
    }

    if (!name) {
      name = paramCaseToCamelCase(option.name);
    }

    const hasDefaultValue: boolean = (!opts.ignoreDefaults ||
      typeof opts.ignoreDefaults[name] === "undefined") &&
      typeof ctx.flags[name] === "undefined" && (
        typeof option.default !== "undefined" ||
        typeof defaultValue !== "undefined"
      );

    if (hasDefaultValue) {
      ctx.flags[name] = getDefaultValue(option) ?? defaultValue;
      defaultValues[option.name] = true;
      if (typeof option.value === "function") {
        ctx.flags[name] = option.value(ctx.flags[name]);
      }
    }
  }

  return defaultValues;
}

function validateStandaloneOption<TType extends string>(
  ctx: ParseFlagsContext,
  options: Map<string, FlagOptions<TType>>,
  optionNames: Array<string>,
  defaultValues: Record<string, boolean>,
): void {
  if (!ctx.standalone || optionNames.length === 1) {
    return;
  }

  // Don't throw an error if all values are coming from the default option.
  for (const [_, opt] of options) {
    if (!defaultValues[opt.name] && opt !== ctx.standalone) {
      throw new OptionNotCombinableError(ctx.standalone.name);
    }
  }
}

function validateConflictingOptions<TType extends string>(
  ctx: ParseFlagsContext,
  option: FlagOptions<TType>,
): void {
  if (!option.conflicts?.length) {
    return;
  }
  for (const flag of option.conflicts) {
    if (isset(flag, ctx.flags)) {
      throw new ConflictingOptionError(option.name, flag);
    }
  }
}

function validateDependingOptions<TType extends string>(
  ctx: ParseFlagsContext,
  option: FlagOptions<TType>,
  defaultValues: Record<string, boolean>,
): void {
  if (!option.depends) {
    return;
  }
  for (const flag of option.depends) {
    // Don't throw an error if the value is coming from the default option.
    if (!isset(flag, ctx.flags) && !defaultValues[option.name]) {
      throw new DependingOptionError(option.name, flag);
    }
  }
}

function validateRequiredValues<TType extends string>(
  ctx: ParseFlagsContext,
  option: FlagOptions<TType>,
  name: string,
): void {
  if (!isValueFlag(option)) {
    return;
  }
  const isArray = option.args.length > 1;

  for (let i = 0; i < option.args.length; i++) {
    const arg: ArgumentOptions<TType> = option.args[i];
    if (arg.optional) {
      continue;
    }
    const hasValue = isArray
      ? typeof (ctx.flags[name] as Array<unknown>)[i] !== "undefined"
      : typeof ctx.flags[name] !== "undefined";

    if (!hasValue) {
      throw new MissingOptionValueError(option.name);
    }
  }
}

function validateRequiredOptions<TType extends string>(
  ctx: ParseFlagsContext,
  options: Map<string, FlagOptions<TType>>,
  opts: ParseFlagsOptions<TType>,
): void {
  if (!opts.flags?.length) {
    return;
  }
  const optionsValues = [...options.values()];

  for (const option of opts.flags) {
    if (!option.required || paramCaseToCamelCase(option.name) in ctx.flags) {
      continue;
    }
    const conflicts = option.conflicts ?? [];
    const hasConflict = conflicts.find((flag: string) => !!ctx.flags[flag]);
    const hasConflicts = hasConflict ||
      optionsValues.find((opt) =>
        opt.conflicts?.find((flag: string) => flag === option.name)
      );

    if (hasConflicts) {
      continue;
    }
    throw new MissingRequiredOptionError(option.name);
  }
}

/**
 * Check if value exists for flag.
 * @param flagName  Flag name.
 * @param flags     Parsed values.
 */
function isset(flagName: string, flags: Record<string, unknown>): boolean {
  const name = paramCaseToCamelCase(flagName);
  // return typeof values[ name ] !== 'undefined' && values[ name ] !== false;
  return typeof flags[name] !== "undefined";
}
