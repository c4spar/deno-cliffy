export function exit(code: number): never {
  // deno-lint-ignore no-explicit-any
  const exit: (code: number) => never = (globalThis as any).Deno?.exit ??
    // deno-lint-ignore no-explicit-any
    (globalThis as any).process?.exit;

  if (exit) {
    exit(code);
  } else {
    throw new Error("unsupported runtime");
  }
}
