export function getEnv(name: string): string | undefined {
  return "Deno" in globalThis
    // deno-lint-ignore no-explicit-any
    ? (globalThis as any).Deno.env.get(name)
    : "process" in globalThis
    // deno-lint-ignore no-explicit-any
    ? (globalThis as any).process.env[name]
    : undefined;
}
