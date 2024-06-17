export function writeSync(data: Uint8Array): void {
  if ("Deno" in globalThis) {
    // deno-lint-ignore no-explicit-any
    (globalThis as any).Deno.stdout.writeSync(data);
  } else if ("process" in globalThis) {
    // deno-lint-ignore no-explicit-any
    (globalThis as any).process.stdout.write(
      // deno-lint-ignore no-explicit-any
      (globalThis as any).Buffer.from(data),
    );
  } else {
    throw new Error("unsupported runtime");
  }
}
