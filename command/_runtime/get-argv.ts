export function getArgv(): Array<string> {
  // deno-lint-ignore no-explicit-any
  const { Deno, process } = globalThis as any;

  return Deno?.args ?? process?.argv.slice(2) ?? [];
}
