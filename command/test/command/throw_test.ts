import { test } from "@cliffy/internal/testing/test";
import { assertThrows } from "@std/assert";
import { Command, ValidationError } from "../../mod.ts";

test("[command] should throw error", () => {
  assertThrows(
    () =>
      new Command()
        .command("child")
        .throw(new Error("some error message")),
    Error,
    "some error message",
  );
});

test("[command] should throw validation error", () => {
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
