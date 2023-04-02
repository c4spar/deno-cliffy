import { ansi } from "../../../../ansi/ansi.ts";
import { assertType, IsExact } from "../../../../dev_deps.ts";
import { Checkbox, CheckboxOptions } from "../../../checkbox.ts";
import { Confirm } from "../../../confirm.ts";
import { Input } from "../../../input.ts";
import { Number } from "../../../number.ts";
import {
  MappedPromptOptions,
  prompt,
  PromptMiddleware,
  PromptOptions,
} from "../../../prompt.ts";
import { Toggle } from "../../../toggle.ts";

export const tests = import.meta.main ? null : {
  "should check an option": ansi
    // input
    .text("f")
    .text("o")
    .text("o")
    .text("\n")
    // number
    .text("4")
    .text("3")
    .text("\n")
    // confirm
    .text("y")
    .text("\n")
    // toggle
    .text("y")
    .text("n")
    .text("y")
    .text("\n")
    // checkbox
    .cursorDown
    .text(" ")
    .cursorDown
    .text(" ")
    .text("\n")
    .toArray(),
};

if (import.meta.main) {
  const checkboxOptions: PromptOptions<
    "checkbox",
    typeof Checkbox,
    { input?: string }
  > = {
    name: "checkbox",
    type: Checkbox,
    message: "Select an option",
    options: [
      { name: "Foo", value: "foo" },
      { name: "Bar", value: "bar" },
      { name: "Baz", value: "baz" },
    ],
    before({ input }, next) {
      console.log("[checkbox:before] input is:", input);
      return next();
    },
  };

  const result = await prompt([{
    name: "input",
    type: Input,
    message: "Enter some text",
    default: "default value",
  }, {
    name: "number",
    type: Number,
    message: ({ input }) => `Input is ${input}. Enter a number`,
    default: ({ input }) => input?.length,
  }, {
    name: "confirm",
    type: Confirm,
    message: "Please confirm",
    hint: "a hint",
  }, {
    name: "toggle",
    type: Toggle,
    message: "Please toggle",
    hint: ({ number }) => `number is ${number} some hint`,
    default: false,
  }, checkboxOptions], {
    reader: Deno.stdin,
    writer: Deno.stderr,
  });

  assertType<
    IsExact<typeof result, {
      checkbox?: string[] | undefined;
      input?: string | undefined;
      number?: number | undefined;
      confirm?: boolean | undefined;
      toggle?: boolean | undefined;
    }>
  >(true);

  assertType<
    IsExact<
      typeof checkboxOptions,
      & {
        name: "checkbox";
        type: typeof Checkbox;
        before?: PromptMiddleware<{ checkbox?: Array<string>; input?: string }>;
        after?: PromptMiddleware<{ checkbox?: Array<string>; input?: string }>;
      }
      & MappedPromptOptions<
        CheckboxOptions,
        { checkbox?: Array<string>; input?: string }
      >
    >
  >(true);

  console.log(result);
}
