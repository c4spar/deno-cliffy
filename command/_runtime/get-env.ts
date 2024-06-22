export function getEnv(name: string): string | undefined {
  // deno-lint-ignore no-explicit-any
  const { Deno, process } = globalThis as any;

  return Deno?.env.get(name) ?? process.env[name];
}
