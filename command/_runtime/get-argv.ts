export function getArgv(): Array<string> {
  return "Deno" in globalThis
    ? (globalThis as any).Deno.args
    : "process" in globalThis
    ? (globalThis as any).process.argv.slice(2)
    : [];
}
