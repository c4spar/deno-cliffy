import { Input } from "../../../input.ts";

export const tests = import.meta.main ? null : {
  "should work without --location flag": ["yes", "\n"],
};

if (import.meta.main) {
  await Input.prompt({
    message: "Works without --location?",
    default: "hope so",
  });
}
