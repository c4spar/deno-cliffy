import { OptionType } from "../flags/types.ts";
import { green, magenta, red, yellow } from "./deps.ts";
import type { IArgument } from "./types.ts";

/** Arguments parser helper class. */
export class ArgumentsParser {
  private static readonly ARGUMENT_REGEX = /^[<\[].+[\]>]$/;
  private static readonly ARGUMENT_DETAILS_REGEX = /[<\[:>\]]/;

  /**
   * Split options and arguments.
   * @param args Arguments definition: `--color, -c <color1:string> <color2:string>`
   *
   * For example: `-c, --color <color1:string> <color2:string>`
   *
   * Will result in:
   * ```
   * {
   *   flags: [ "-c", "--color" ],
   *   typeDefinition: "<color1:string> <color2:string>"
   * }
   * ```
   */
  public static splitArguments(
    args: string,
  ): { flags: string[]; typeDefinition: string } {
    const parts = args.trim().split(/[, =] */g);
    const typeParts = [];

    while (
      parts[parts.length - 1] &&
      this.ARGUMENT_REGEX.test(parts[parts.length - 1])
    ) {
      typeParts.unshift(parts.pop());
    }

    const typeDefinition: string = typeParts.join(" ");

    return { flags: parts, typeDefinition };
  }

  /**
   * Parse arguments string.
   * @param argsDefinition Arguments definition: `<color1:string> <color2:string>`
   */
  public static parseArgumentsDefinition(argsDefinition: string): IArgument[] {
    const argumentDetails: IArgument[] = [];

    let hasOptional = false;
    let hasVariadic = false;
    const parts: string[] = argsDefinition.split(/ +/);

    for (const arg of parts) {
      if (hasVariadic) {
        throw new Error("An argument can not follow an variadic argument.");
      }

      const parts: string[] = arg.split(this.ARGUMENT_DETAILS_REGEX);
      const type: string | undefined = parts[2] || OptionType.STRING;

      const details: IArgument = {
        optionalValue: arg[0] !== "<",
        name: parts[1],
        action: parts[3] || type,
        variadic: false,
        list: type ? arg.indexOf(type + "[]") !== -1 : false,
        type,
      };

      if (!details.optionalValue && hasOptional) {
        throw new Error(
          "An required argument can not follow an optional argument.",
        );
      }

      if (arg[0] === "[") {
        hasOptional = true;
      }

      if (details.name.length > 3) {
        const istVariadicLeft = details.name.slice(0, 3) === "...";
        const istVariadicRight = details.name.slice(-3) === "...";

        hasVariadic = details.variadic = istVariadicLeft || istVariadicRight;

        if (istVariadicLeft) {
          details.name = details.name.slice(3);
        } else if (istVariadicRight) {
          details.name = details.name.slice(0, -3);
        }
      }

      if (details.name) {
        argumentDetails.push(details);
      }
    }

    return argumentDetails;
  }

  /**
   * Colorize arguments string.
   * @param argsDefinition Arguments definition: `<color1:string> <color2:string>`
   */
  public static highlightArguments(argsDefinition: string) {
    if (!argsDefinition) {
      return "";
    }

    return this.parseArgumentsDefinition(argsDefinition)
      .map((arg: IArgument) => this.highlightArgumentDetails(arg)).join(" ");
  }

  /**
   * Colorize argument string.
   * @param arg Argument details.
   */
  public static highlightArgumentDetails(arg: IArgument): string {
    let str = "";

    str += yellow(arg.optionalValue ? "[" : "<");

    let name = "";
    name += arg.name;
    if (arg.variadic) {
      name += "...";
    }
    name = magenta(name);

    str += name;

    // if ( arg.name !== arg.type ) {
    str += yellow(":");
    str += red(arg.type);
    // }

    if (arg.list) {
      str += green("[]");
    }

    str += yellow(arg.optionalValue ? "]" : ">");

    return str;
  }
}
