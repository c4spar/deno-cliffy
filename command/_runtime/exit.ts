export function exit(code: number): never {
  const exit: (code: number) => never = (globalThis as any).Deno?.exit ??
    (globalThis as any).process?.exit;

  if (exit) {
    exit(code);
  } else {
    throw new Error("unsupported runtime");
  }
}
