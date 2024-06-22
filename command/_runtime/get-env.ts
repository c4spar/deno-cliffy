export function getEnv(name: string): string | undefined {
  // deno-lint-ignore no-explicit-any
  const { Deno, process } = globalThis as any;

  if (Deno) {
    return Deno.env.get(name);
  } else if (process) {
    return process.env[name];
  }

  throw new Error("unsupported runtime");
}
