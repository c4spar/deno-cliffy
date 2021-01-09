import { didYouMean } from "../flags/_utils.ts";
import { Command } from "./command.ts";

export class CommandError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CommandError.prototype);
  }
}

export class MissingCommandName extends CommandError {
  constructor() {
    super("Missing command name.");
    Object.setPrototypeOf(this, MissingCommandName.prototype);
  }
}

export class DuplicateCommandName extends CommandError {
  constructor(name: string) {
    super(`Duplicate command name "${name}".`);
    Object.setPrototypeOf(this, DuplicateCommandName.prototype);
  }
}

export class DuplicateCommandAlias extends CommandError {
  constructor(alias: string) {
    super(`Duplicate command alias "${alias}".`);
    Object.setPrototypeOf(this, DuplicateCommandAlias.prototype);
  }
}

export class UnknownCommand extends CommandError {
  constructor(
    name: string,
    commands: Array<Command>,
    excluded?: Array<string>,
  ) {
    super(
      `Unknown command "${name}".${
        didYouMeanCommand(name, commands, excluded)
      }`,
    );
    Object.setPrototypeOf(this, UnknownCommand.prototype);
  }
}

export class DuplicateType extends CommandError {
  constructor(name: string) {
    super(`Type with name "${name}" already exists.`);
    Object.setPrototypeOf(this, DuplicateType.prototype);
  }
}

export class DuplicateCompletion extends CommandError {
  constructor(name: string) {
    super(`Completion with name "${name}" already exists.`);
    Object.setPrototypeOf(this, DuplicateCompletion.prototype);
  }
}

export class DuplicateExample extends CommandError {
  constructor(name: string) {
    super(`Example with name "${name}" already exists.`);
    Object.setPrototypeOf(this, DuplicateExample.prototype);
  }
}

export class DuplicateEnvironmentVariable extends CommandError {
  constructor(name: string) {
    super(`Environment variable with name "${name}" already exists.`);
    Object.setPrototypeOf(this, DuplicateEnvironmentVariable.prototype);
  }
}

export class EnvironmentVariableSingleValue extends CommandError {
  constructor(name: string) {
    super(
      `An environment variable can only have one value but "${name}" has more than one.`,
    );
    Object.setPrototypeOf(this, EnvironmentVariableSingleValue.prototype);
  }
}

export class EnvironmentVariableOptionalValue extends CommandError {
  constructor(name: string) {
    super(
      `An environment variable can not have an optional value but "${name}" is defined as optional.`,
    );
    Object.setPrototypeOf(this, EnvironmentVariableOptionalValue.prototype);
  }
}

export class EnvironmentVariableVariadicValue extends CommandError {
  constructor(name: string) {
    super(
      `An environment variable can not have an variadic value but "${name}" is defined as variadic.`,
    );
    Object.setPrototypeOf(this, EnvironmentVariableVariadicValue.prototype);
  }
}

export class DefaultCommandNotFound extends CommandError {
  constructor(name: string, commands: Array<Command>) {
    super(
      `Default command "${name}" not found.${
        didYouMeanCommand(name, commands)
      }`,
    );
    Object.setPrototypeOf(this, DefaultCommandNotFound.prototype);
  }
}

export class CommandExecutableNotFound extends CommandError {
  constructor(name: string, files: Array<string>) {
    super(
      `Command executable not found: ${name}:\n    - ${
        files.join("\\n    - ")
      }`,
    );
    Object.setPrototypeOf(this, CommandExecutableNotFound.prototype);
  }
}

export class NoArgumentsAllowed extends CommandError {
  constructor(name: string) {
    super(`No arguments allowed for command "${name}".`);
    Object.setPrototypeOf(this, NoArgumentsAllowed.prototype);
  }
}

export class MissingArguments extends CommandError {
  constructor(args: Array<string>) {
    super("Missing argument(s): " + args.join(", "));
    Object.setPrototypeOf(this, MissingArguments.prototype);
  }
}

export class MissingArgument extends CommandError {
  constructor(arg: string) {
    super(`Missing argument "${arg}".`);
    Object.setPrototypeOf(this, MissingArgument.prototype);
  }
}

export class TooManyArguments extends CommandError {
  constructor(args: Array<string>) {
    super(`Too many arguments: ${args.join(" ")}`);
    Object.setPrototypeOf(this, TooManyArguments.prototype);
  }
}

export class UnknownCompletionCommand extends CommandError {
  constructor(name: string, commands: Array<Command>) {
    super(
      `Auto-completion failed. Unknown command "${name}".${
        didYouMeanCommand(name, commands)
      }`,
    );
    Object.setPrototypeOf(this, UnknownCompletionCommand.prototype);
  }
}

function didYouMeanCommand(
  command: string,
  commands: Array<Command>,
  excludes: Array<string> = [],
): string {
  const commandNames = commands
    .map((command) => command.getName())
    .filter((command) => !excludes.includes(command));
  return didYouMean(" Did you mean command", command, commandNames);
}
