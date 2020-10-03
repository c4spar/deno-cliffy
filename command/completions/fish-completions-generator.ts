import type { Command } from "../command.ts";
import type { IOption } from "../types.ts";

interface CompleteOptions {
  shortOption?: string;
  longOption?: string;
  description?: string;
  arguments?: string;
  required?: boolean;
  standalone?: boolean;
}

export class FishCompletionsGenerator {
  public static generate(cmd: Command) {
    return new FishCompletionsGenerator(cmd).generate();
  }

  private constructor(protected cmd: Command) {}

  /** Generates fish completions code. */
  private generate(): string {
    const path = this.cmd.getPath();
    const version: string | undefined = this.cmd.getVersion()
      ? ` v${this.cmd.getVersion()}`
      : "";

    return `#!/usr/bin/env fish
# fish completion support for ${path}${version}

function __fish_using_command
  set _${replaceSpecialChars(this.cmd.getName())}_cmds ${
      this.getCommandFnNames(this.cmd).join(" ")
    }
  set cmd "_"
  set words (commandline -opc)
  for word in $words
    switch $word
      case '-*'
        continue
      case '*'
        set word (string replace -r -a '\\W' '_' $word)
        set cmd_tmp $cmd"_$word"
        if contains $cmd_tmp $_${replaceSpecialChars(this.cmd.getName())}_cmds
          set cmd $cmd_tmp
        end
    end
  end
  if [ "$cmd" = "$argv[1]" ]
    return 0
  end
  return 1
end

${this.generateCompletions(this.cmd).trim()}
`;
  }

  /** Generates fish completions method for given command and child commands. */
  private generateCompletions(command: Command): string {
    const parent: Command | undefined = command.getParent();
    const completionsPath: string = command.getPath().split(" ").slice(1).join(
      " ",
    );

    let result = ``;

    if (parent) {
      // command
      result += "\n" + this.complete(parent, {
        description: command.getShortDescription(),
        arguments: command.getName(),
      });
    }

    // arguments
    const commandArgs = command.getArguments();
    if (commandArgs.length) {
      result += "\n" + this.complete(command, {
        arguments: commandArgs.length
          ? this.completionCommand(
            commandArgs[0].action + " " + completionsPath,
          )
          : undefined,
      });
    }

    // options
    for (const option of command.getOptions(false)) {
      result += "\n" + this.completeOption(command, option);
    }

    for (const subCommand of command.getCommands(false)) {
      result += this.generateCompletions(subCommand);
    }

    return result;
  }

  private completeOption(command: Command, option: IOption) {
    const completionsPath: string = command.getPath().split(" ").slice(1).join(
      " ",
    );
    const flags = option.flags.split(/[, ] */g);

    const shortOption: string | undefined = flags.find((flag) =>
      flag.length === 2
    )?.replace(/^(-)+/, "");

    const longOption: string | undefined = flags.find((flag) => flag.length > 2)
      ?.replace(/^(-)+/, "");

    const cmd = ["complete"];
    cmd.push("-c", this.cmd.getName());
    cmd.push(
      "-n",
      `'__fish_using_command __${replaceSpecialChars(command.getPath())}'`,
    );
    shortOption && cmd.push("-s", shortOption);
    longOption && cmd.push("-l", longOption);
    // option.standalone && cmd.push("-x");
    // option.args[0]?.requiredValue &&
    cmd.push("-k");
    cmd.push("-f");
    if (option.args.length) {
      cmd.push("-r");
      cmd.push(
        "-a",
        this.completionCommand(option.args[0].action + " " + completionsPath),
      );
      // cmd.push("-a", "'(commandline -opc)'");
    }
    cmd.push("-d", `'${option.description}'`);
    return cmd.join(" ");
  }

  private complete(command: Command, options: CompleteOptions) {
    const cmd = ["complete"];
    cmd.push("-c", this.cmd.getName());
    cmd.push(
      "-n",
      `'__fish_using_command __${replaceSpecialChars(command.getPath())}'`,
    );
    options.shortOption && cmd.push("-s", options.shortOption);
    options.longOption && cmd.push("-l", options.longOption);
    // options.standalone && cmd.push("-x");
    // options.required &&
    // cmd.push("-r");
    cmd.push("-k");
    cmd.push("-f");
    options.arguments && cmd.push("-a", options.arguments);
    options.description && cmd.push("-d", `'${options.description}'`);
    return cmd.join(" ");
  }

  private completionCommand(cmd: string): string {
    return `'(${this.cmd.getName()} completions complete -l ${cmd})'`;
  }

  private getCommandFnNames(
    cmd: Command,
    cmds: Array<string> = [],
  ): Array<string> {
    cmds.push(`__${replaceSpecialChars(cmd.getPath())}`);
    cmd.getCommands(false).forEach((command) => {
      this.getCommandFnNames(command, cmds);
    });
    return cmds;
  }
}

function replaceSpecialChars(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "_");
}
