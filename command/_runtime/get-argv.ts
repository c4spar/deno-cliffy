export function getArgv(): Array<string> {
  return "Deno" in globalThis
    // deno-lint-ignore no-explicit-any
    ? (globalThis as any).Deno.args
    : "process" in globalThis
    // deno-lint-ignore no-explicit-any
    ? (globalThis as any).process.argv.slice(2)
    : [];
}
