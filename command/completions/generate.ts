import type { Command } from "../command.ts";
import { BashCompletionsGenerator } from "./_bash_completions_generator.ts";
import { FishCompletionsGenerator } from "./_fish_completions_generator.ts";
import { ZshCompletionsGenerator } from "./_zsh_completions_generator.ts";

/**
 * Generates shell completions script
 */
export function generateCompletions(
  shell: "bash" | "fish" | "zsh",
  name: string,
  cmd: Command,
): string {
  switch (shell) {
    case "bash":
      return BashCompletionsGenerator.generate(name, cmd);
    case "zsh":
      return ZshCompletionsGenerator.generate(name, cmd);
    case "fish":
      return FishCompletionsGenerator.generate(name, cmd);
    default:
      throw new Error(`Unsupported shell: ${shell}`);
  }
}
