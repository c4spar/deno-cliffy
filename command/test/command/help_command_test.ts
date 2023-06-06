import { assertEquals } from "../../../dev_deps.ts";
import { CompletionsCommand } from "../../completions/completions_command.ts";
import { HelpCommand } from "../../help/help_command.ts";
import { Command } from "../../command.ts";

function command(defaultOptions?: boolean, hintOption?: boolean) {
  const cmd = new Command()
    .throwErrors()
    .version("1.0.0")
    .description("Test description ...")
    .help({
      hints: true,
      types: true,
      colors: false,
    });

  if (!defaultOptions) {
    cmd.versionOption(false)
      .helpOption(false);
  }

  cmd.option("-t, --test [val:string]", "test description")
    .option(
      "-D, --default [val:string]",
      "I have a default value!",
      { default: "test" },
    )
    .option("-r, --required [val:string]", "I am required!", { required: true })
    .option(
      "-H, --hidden [val:string]",
      "Nobody knows about me!",
      { hidden: true },
    )
    .option(
      "-d, --depends [val:string]",
      "I depend on test!",
      { depends: ["test"] },
    )
    .option(
      "-c, --conflicts [val:string]",
      "I conflict with test!",
      { conflicts: ["test"] },
    );

  if (hintOption) {
    cmd.option("-a, --all <val:string>", "I have many hints!", {
      default: "test",
      required: true,
      depends: ["test"],
      conflicts: ["depends"],
    });
  }

  cmd
    .env("SOME_ENV_VAR=<value:number>", "Description ...")
    .env("SOME_ENV_VAR_2 <value>", "Description 2 ...")
    .env("SOME_REQUIRED_ENV_VAR=<value>", "This one is required!", {
      required: true,
    })
    .command("help", new HelpCommand())
    .command("completions", new CompletionsCommand())
    .command("sub-command <input:string> <output:string>")
    .description("sub command description.")
    .command("hidden-command <input:string> <output:string>")
    .description("Nobody knows about me!")
    .hidden()
    .reset();

  return cmd;
}

Deno.test({
  name: "command: help command with line break",
  fn() {
    const output: string = command(true, true).getHelp();

    assertEquals(
      output,
      `
Usage:   COMMAND --required [val:string] --all <val:string>
Version: 1.0.0                                             

Description:

  Test description ...

Options:

  -h, --help                     - Show this help.                                                                                   
  -V, --version                  - Show the version number for this program.                                                         
  -t, --test       [val:string]  - test description                                                                                  
  -D, --default    [val:string]  - I have a default value!                    (Default: "test")                                      
  -r, --required   [val:string]  - I am required!                             (required)                                             
  -d, --depends    [val:string]  - I depend on test!                          (Depends: --test)                                      
  -c, --conflicts  [val:string]  - I conflict with test!                      (Conflicts: --test)                                    
  -a, --all        <val:string>  - I have many hints!                         (required, Default: "test", Depends: --test, Conflicts:
                                                                              --depends)                                             

Commands:

  help         [command:command]               - Show this help or the help of a sub-command.
  completions                                  - Generate shell completions.                 
  sub-command  <input:string> <output:string>  - sub command description.                    

Environment variables:

  SOME_ENV_VAR           <value:number>  - Description ...                  
  SOME_ENV_VAR_2         <value:string>  - Description 2 ...                
  SOME_REQUIRED_ENV_VAR  <value:string>  - This one is required!  (required)
`,
    );
  },
});

Deno.test({
  name: "command: help command with line break but without default options",
  fn() {
    const output: string = command(false, true).getHelp();

    assertEquals(
      output,
      `
Usage:   COMMAND --required [val:string] --all <val:string>
Version: 1.0.0                                             

Description:

  Test description ...

Options:

  -t, --test       [val:string]  - test description                                                                
  -D, --default    [val:string]  - I have a default value!  (Default: "test")                                      
  -r, --required   [val:string]  - I am required!           (required)                                             
  -d, --depends    [val:string]  - I depend on test!        (Depends: --test)                                      
  -c, --conflicts  [val:string]  - I conflict with test!    (Conflicts: --test)                                    
  -a, --all        <val:string>  - I have many hints!       (required, Default: "test", Depends: --test, Conflicts:
                                                            --depends)                                             

Commands:

  help         [command:command]               - Show this help or the help of a sub-command.
  completions                                  - Generate shell completions.                 
  sub-command  <input:string> <output:string>  - sub command description.                    

Environment variables:

  SOME_ENV_VAR           <value:number>  - Description ...                  
  SOME_ENV_VAR_2         <value:string>  - Description 2 ...                
  SOME_REQUIRED_ENV_VAR  <value:string>  - This one is required!  (required)
`,
    );
  },
});
