import { assertThrows } from "../../../dev_deps.ts";
import { Command, ValidationError } from "../../mod.ts";

Deno.test("[command] should throw error", () => {
  assertThrows(
    () =>
      new Command()
        .command("child")
        .throw(new Error("some error message")),
    Error,
    "some error message",
  );
});

Deno.test("[command] should throw validation error", () => {
  assertThrows(
    () =>
      new Command()
        .throwErrors()
        .command("child")
        .throw(new ValidationError("some error message")),
    ValidationError,
    "some error message",
  );
});
