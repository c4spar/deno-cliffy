import { assertEquals, assertThrowsAsync } from "../../dev_deps.ts";
import { inject, prompt } from "../prompt.ts";
import { Checkbox } from "../checkbox.ts";
import { Confirm } from "../confirm.ts";
import { Number } from "../number.ts";
import { Input } from "../input.ts";

Deno.test("prompt - prompt list", async () => {
  let beforeCalled = 0;
  let afterCalled = 0;
  const expectedResult = {
    animals: ["dog", "snake"],
    name: "foo",
    confirmed: true,
    age: 99,
  };
  const expectedConfirmedResult = {
    animals: ["dog", "snake"],
    name: "foo",
    confirmed: true,
  };

  inject({
    animals: ["dog", "snake"],
    name: "foo",
    confirmed: "Yes",
    age: "99",
  });

  const result = await prompt([{
    name: "animals",
    message: `Select some animal's`,
    type: Checkbox,
    options: ["dog", "cat", "snake"],
  }, {
    name: "name",
    message: `Enter your name`,
    type: Input,
  }, {
    name: "confirmed",
    message: "Please confirm?",
    type: Confirm,
    after: async (result, next) => {
      afterCalled++;
      assertEquals(result, expectedConfirmedResult);
      await next();
    },
  }, {
    before: async (result, next) => {
      assertEquals(result, expectedConfirmedResult);
      beforeCalled++;
      await next();
    },
    name: "age",
    message: "How old are you?",
    type: Number,
  }, {
    before: (result, _) => {
      assertEquals(result, expectedResult);
      /** skip unknown */
    },
    name: "unknown",
    message: "...",
    type: Number,
  }]);

  assertEquals(result, expectedResult);
  assertEquals(beforeCalled, 1);
  assertEquals(afterCalled, 1);

  // @ts-expect-error Foo is not defined.
  assertEquals(result.foo, undefined);
  // @ts-expect-error Type string is not assignable to type number.
  result.animals && isNaN(result.animals[0]);
  // @ts-expect-error Type string is not assignable to type number.
  result.name && isNaN(result.name);
  result.age && isNaN(result.age);
});

Deno.test("prompt - prompt list - before next callback", async () => {
  await assertThrowsAsync(
    async () => {
      inject({
        name: "foo",
      });

      await prompt([{
        name: "name",
        message: `Enter your name`,
        type: Input,
        before: async ({ name }, next) => {
          // @ts-expect-error name is not a number.
          isNaN(name);
          // @ts-expect-error Foo does not exist.
          await next("foo");
        },
      }]);
    },
    Error,
    `Invalid prompt name: foo, allowed prompt names: name`,
  );
});

Deno.test("prompt - prompt list - after next callback", async () => {
  await assertThrowsAsync(
    async () => {
      inject({
        name: "foo",
      });

      await prompt([{
        name: "name",
        message: `Enter your name`,
        type: Input,
        after: async ({ name }, next) => {
          // @ts-expect-error name is not a number.
          isNaN(name);
          // @ts-expect-error Foo does not exist.
          await next("foo");
        },
      }]);
    },
    Error,
    `Invalid prompt name: foo, allowed prompt names: name`,
  );
});
