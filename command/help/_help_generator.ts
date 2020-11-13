import { Table } from "../../table/table.ts";
import { ArgumentsParser } from "../_arguments_parser.ts";
import type { Command } from "../command.ts";
import { blue, bold, dim, magenta, red, yellow } from "../deps.ts";
import type { IEnvVar, IExample, IOption } from "../types.ts";

/** Help text generator. */
export class HelpGenerator {
  private indent = 2;

  /** Generate help text for given command. */
  public static generate(cmd: Command): string {
    return new HelpGenerator(cmd).generate();
  }

  private constructor(protected cmd: Command) {}

  private generate(): string {
    return this.generateHeader() +
      this.generateDescription() +
      this.generateOptions() +
      this.generateCommands() +
      this.generateEnvironmentVariables() +
      this.generateExamples() +
      "\n";
  }

  private generateHeader(): string {
    const rows = [
      [
        bold("Usage:"),
        magenta(
          `${this.cmd.getPath()}${
            this.cmd.getArgsDefinition()
              ? " " + this.cmd.getArgsDefinition()
              : ""
          }`,
        ),
      ],
    ];
    const version: string | undefined = this.cmd.getVersion();
    if (version) {
      rows.push([bold("Version:"), yellow(`v${this.cmd.getVersion()}`)]);
    }
    return "\n" +
      Table.from(rows)
        .indent(this.indent)
        .padding(1)
        .toString() +
      "\n";
  }

  private generateDescription(): string {
    if (!this.cmd.getDescription()) {
      return "";
    }
    return this.label("Description") +
      Table.from([
        [this.cmd.getDescription()],
      ])
        .indent(this.indent * 2)
        .maxColWidth(140)
        .padding(1)
        .toString() +
      "\n";
  }

  private generateOptions(): string {
    const options = this.cmd.getOptions(false);
    if (!options.length) {
      return "";
    }

    const hasTypeDefinitions: boolean = !!options.find((option) =>
      !!option.typeDefinition
    );

    if (hasTypeDefinitions) {
      return this.label("Options") +
        Table.from([
          ...options.map((option: IOption) => [
            option.flags.split(/,? +/g).map((flag) => blue(flag)).join(", "),
            ArgumentsParser.highlightArguments(option.typeDefinition || ""),
            red(bold("-")) + " " +
            option.description.split("\n").shift() as string,
            this.generateHints(option),
          ]),
        ])
          .padding([2, 2, 2])
          .indent(this.indent * 2)
          .maxColWidth([60, 60, 80, 60])
          .toString() +
        "\n";
    }

    return this.label("Options") +
      Table.from([
        ...options.map((option: IOption) => [
          option.flags.split(/,? +/g).map((flag) => blue(flag)).join(", "),
          red(bold("-")) + " " +
          option.description.split("\n").shift() as string,
          this.generateHints(option),
        ]),
      ])
        .padding([2, 2])
        .indent(this.indent * 2)
        .maxColWidth([60, 80, 60])
        .toString() +
      "\n";
  }

  private generateCommands(): string {
    const commands = this.cmd.getCommands(false);
    if (!commands.length) {
      return "";
    }

    const hasTypeDefinitions: boolean = !!commands.find((command) =>
      !!command.getArgsDefinition()
    );

    if (hasTypeDefinitions) {
      return this.label("Commands") +
        Table.from([
          ...commands.map((command: Command) => [
            [command.getName(), ...command.getAliases()].map((name) =>
              blue(name)
            ).join(", "),
            ArgumentsParser.highlightArguments(
              command.getArgsDefinition() || "",
            ),
            red(bold("-")) + " " +
            command.getDescription().split("\n").shift() as string,
          ]),
        ])
          .padding([2, 2, 2])
          .indent(this.indent * 2)
          .toString() +
        "\n";
    }

    return this.label("Commands") +
      Table.from([
        ...commands.map((command: Command) => [
          [command.getName(), ...command.getAliases()].map((name) => blue(name))
            .join(", "),
          red(bold("-")) + " " +
          command.getDescription().split("\n").shift() as string,
        ]),
      ])
        .padding([2, 2])
        .indent(this.indent * 2)
        .toString() +
      "\n";
  }

  private generateEnvironmentVariables(): string {
    const envVars = this.cmd.getEnvVars(false);
    if (!envVars.length) {
      return "";
    }
    return this.label("Environment variables") +
      Table.from([
        ...envVars.map((envVar: IEnvVar) => [
          envVar.names.map((name: string) => blue(name)).join(", "),
          ArgumentsParser.highlightArgumentDetails(envVar.details),
          `${red(bold("-"))} ${envVar.description}`,
        ]),
      ])
        .padding(2)
        .indent(this.indent * 2)
        .toString() +
      "\n";
  }

  private generateExamples(): string {
    const examples = this.cmd.getExamples(); ///Users/psychedelix/workspace/deno/deno-cliffy/command/test/option/action_test.ts
    if (!examples.length) {
      return "";
    }
    return this.label("Examples") +
      Table.from(examples.map((example: IExample) => [
        dim(bold(`${capitalize(example.name)}:`)),
        `\n${example.description}`,
      ]))
        .padding(1)
        .indent(this.indent * 2)
        .maxColWidth(150)
        .toString() +
      "\n";
  }

  private generateHints(option: IOption): string {
    const hints = [];

    option.required && hints.push(yellow(`required`));
    typeof option.default !== "undefined" &&
      hints.push(
        blue(bold(`Default: `)) +
          blue(Deno.inspect(option.default, { depth: 1 })),
      );
    option.depends?.length &&
      hints.push(
        red(bold(`depends: `)) +
          option.depends.map((depends) => red(depends)).join(", "),
      );
    option.conflicts?.length &&
      hints.push(
        red(bold(`conflicts: `)) +
          option.conflicts.map((conflict) => red(conflict)).join(", "),
      );

    if (hints.length) {
      return `(${hints.join(", ")})`;
    }

    return "";
  }

  private label(label: string) {
    return "\n" +
      " ".repeat(this.indent) + bold(`${label}:`) +
      "\n\n";
  }
}

function capitalize(string: string): string {
  return string?.charAt(0).toUpperCase() + string.slice(1) ?? "";
}
