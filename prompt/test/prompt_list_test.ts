import { assertEquals } from "../../dev_deps.ts";
import { inject, prompt } from "../prompt.ts";
import { Checkbox } from "../checkbox.ts";
import { Confirm } from "../confirm.ts";
import { Number } from "../number.ts";

Deno.test("prompt list", async () => {
  let beforeCalled = 0;
  let afterCalled = 0;
  const expectedResult = {
    animals: ["dog", "snake"],
    like: true,
    age: 99,
  };
  const expectedLikeResult = {
    animals: ["dog", "snake"],
    like: true,
  };

  inject({
    animals: ["dog", "snake"],
    like: "Yes",
    age: 99,
  });

  const result = await prompt([{
    name: "animals",
    message: `Select some animal's`,
    type: Checkbox,
    options: ["dog", "cat", "snake"],
  }, {
    name: "like",
    message: "Do you like it?",
    type: Confirm,
    after: async (result, next) => {
      afterCalled++;
      assertEquals(result, expectedLikeResult);
      await next();
    },
  }, {
    before: async (result, next) => {
      assertEquals(result, expectedLikeResult);
      beforeCalled++;
      await next();
    },
    name: "age",
    message: "How old are you?",
    type: Number,
  }, {
    before: async (result, _) => {
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
});
