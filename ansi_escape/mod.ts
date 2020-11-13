export * from "./csi.ts";
export * from "./ansi_escape.ts";
import { AnsiEscape } from "./ansi_escape.ts";

export const tty: AnsiEscape = AnsiEscape.from(Deno.stdout);
