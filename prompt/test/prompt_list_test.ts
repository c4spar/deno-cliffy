import {
  assert,
  IsExact,
} from "https://deno.land/x/conditional_type_checks@1.0.6/mod.ts";
import { assertEquals, assertRejects } from "../../dev_deps.ts";
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
    message: `Select some animals`,
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
      assert<
        IsExact<typeof result, {
          animals?: Array<string>;
          name?: string;
          confirmed?: boolean;
          age?: number;
          unknown?: number;
        }>
      >(true);
      afterCalled++;
      assertEquals(result, expectedConfirmedResult);
      await next();
    },
  }, {
    before: async (result, next) => {
      assert<
        IsExact<typeof result, {
          animals?: Array<string>;
          name?: string;
          confirmed?: boolean;
          age?: number;
          unknown?: number;
        }>
      >(true);
      assertEquals(result, expectedConfirmedResult);
      beforeCalled++;
      await next();
    },
    name: "age",
    message: "How old are you?",
    type: Number,
  }, {
    before: (result, next) => {
      assert<
        IsExact<typeof result, {
          animals?: Array<string>;
          name?: string;
          confirmed?: boolean;
          age?: number;
          unknown?: number;
        }>
      >(true);
      assert<
        IsExact<
          typeof next,
          (
            next?:
              | "animals"
              | "name"
              | "confirmed"
              | "age"
              | "unknown"
              | number
              | true
              | null,
          ) => Promise<void>
        >
      >(true);
      assertEquals(result, expectedResult);
      /** skip unknown */
    },
    name: "unknown",
    message: "...",
    type: Number,
  }]);

  assert<
    IsExact<typeof result, {
      animals?: Array<string>;
      name?: string;
      confirmed?: boolean;
      age?: number;
      unknown?: number;
    }>
  >(true);
  assertEquals(result, expectedResult);
  assertEquals(beforeCalled, 1);
  assertEquals(afterCalled, 1);
});

Deno.test("prompt - prompt list - before next callback", async () => {
  await assertRejects(
    async () => {
      inject({
        name: "foo",
      });

      await prompt([{
        name: "name",
        message: `Enter your name`,
        type: Input,
        before: async (result, next) => {
          assert<IsExact<typeof result, { name?: string }>>(true);
          assert<
            IsExact<
              typeof next,
              (next?: "name" | number | true | null) => Promise<void>
            >
          >(true);
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
  await assertRejects(
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
