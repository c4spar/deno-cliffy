import { Command } from "../command.ts";

export class BashCompletionsGenerator {
  public static generate(cmd: Command) {
    return new BashCompletionsGenerator(cmd).generate();
  }

  private constructor(protected cmd: Command) {}

  /** Generates bash completions code. */
  private generate(): string {
    const path = this.cmd.getPath();
    const version: string | undefined = this.cmd.getVersion()
      ? ` v${this.cmd.getVersion()}`
      : "";

    return `# bash completion support for ${path}${version}

_${replaceSpecialChars(path)}() {
  local word cur prev opts
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  cmd="_"
  opts=""

  ${this.generateCompletions(this.cmd).trim()}
  
  for word in "\${COMP_WORDS[@]}"
  do
    case "\${word}" in
      -*) ;;
      *) 
        cmd_tmp="\${cmd}_\${word//[^[:alnum:]]/_}"
        if type \${cmd_tmp} &>/dev/null; then
          cmd="\${cmd_tmp}"
        else
          break
        fi
    esac
  done
  
  \${cmd}
  
  # shellcheck disable=SC2207
  COMPREPLY=($(compgen -W "\${opts}" -- "\${cur}"))
}

complete -F _${replaceSpecialChars(path)} -o bashdefault -o default ${path}
`;
  }

  /** Generates bash completions method for given command and child commands. */
  private generateCompletions(command: Command, path = "", index = 1): string {
    path = (path ? path + " " : "") + command.getName();
    const commandCompletions = this.generateCommandCompletions(
      command,
      path,
      index,
    );
    const childCommandCompletions: string = command.getCommands(false)
      .filter((subCommand: Command) => subCommand !== command)
      .map((subCommand: Command) =>
        this.generateCompletions(subCommand, path, index + 1)
      )
      .join("");

    return `${commandCompletions}

${childCommandCompletions}`;
  }

  private generateCommandCompletions(
    command: Command,
    path: string,
    index: number,
  ): string {
    const commandNames: string[] = command.getCommands(false)
      .map((subCommand: Command) => subCommand.getName());

    const flags: string[] = command.getOptions(false)
      .map((option) =>
        option.flags
          .split(",")
          .map((flag) => flag.trim())
      )
      .flat();

    const options = command.getOptions(false);
    let opts = "";
    if (options.length) {
      opts = 'case "${prev}" in';
      for (const option of options) {
        opts += `
      ${
          option.flags
            .split(",")
            .map((flag) => flag.trim())
            .join("|")
        })
        # shellcheck disable=SC2207
        COMPREPLY=($(compgen -f "\${cur}"))
        return 0
        ;;`;
      }
      opts += "\n    esac";
    }

    return `  __${replaceSpecialChars(path)}() {
    opts="${[...flags, ...commandNames].join(" ")}"
    if [[ \${cur} == -* || \${COMP_CWORD} -eq ${index} ]] ; then
      # shellcheck disable=SC2207
      COMPREPLY=( $(compgen -W "\${opts}" -- "\${cur}") )
      return 0
    fi
    ${opts}
  }`;
  }
}

function replaceSpecialChars(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "_");
}
