#!/usr/bin/env -S deno run

import { Command } from '../../command/command.ts';
import { CompletionsCommand } from '../../command/completions/completions_command.ts';
import { HelpCommand } from '../../command/help/help_command.ts';

function getCommandFullname(command: Command<any> | undefined): string {
  const names = [];
  let cmd = command;

  while (cmd !== undefined) {
    names.push(cmd.getName());
    cmd = cmd.getParent();
  }

  return names.reverse().join('-');
}

const rootCommand = new Command()
  .name('cliffy')
  .version('1.0.0')
  .description(`Command line framework for Deno`)
  .option('-p, --beep', 'Some option.', {
    default: true,
  })
  .option('--no-beep', 'Negate beep.')
  .option('-f, --foo [value:string]', 'Some string value.', {
    default: 'foo',
  })
  .option('-b, --bar [value:number]', 'Some numeric value.', {
    default: 89,
    depends: ['foo'],
  })
  .option('-B, --baz <value:boolean>', 'Some boolean value.', {
    conflicts: ['beep'],
  })
  .command('help', new HelpCommand().global())
  .command('completions', new CompletionsCommand());

const { cmd, options, literal } = await rootCommand.parse(Deno.args, {
  execute: false,
});

const fullname = getCommandFullname(cmd);

console.log('Command:', fullname);
console.log('Options:', options);
console.log('Literal:', literal);

await globalThis.window.prompt('Press enter to execute...');

await cmd.execute(options, literal);
