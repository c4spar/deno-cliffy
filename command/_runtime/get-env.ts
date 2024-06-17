export function getEnv(name: string): string | undefined {
  return "Deno" in globalThis
    ? (globalThis as any).Deno.env.get(name)
    : "process" in globalThis
    ? (globalThis as any).process.env[name]
    : undefined;
}
