import { colors } from "../../ansi/colors.ts";

const error = colors.bold.red();
const warn = colors.bold.yellow();
const info = colors.bold.blue();

console.log(error("[ERROR]"), "Some error!");
console.log(warn("[WARN]"), "Some warning!");
console.log(info("[INFO]"), "Some information!");
