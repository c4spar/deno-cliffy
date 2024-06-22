export function getNoColor(): boolean {
  // deno-lint-ignore no-explicit-any
  const { Deno, process } = globalThis as any;

  return Deno?.noColor ?? process?.env.NO_COLOR === "1";
}
