#!/usr/bin/env -S deno run

import { prompt } from "@cliffy/prompt";
import { Checkbox } from "@cliffy/prompt/checkbox";
import { Confirm } from "@cliffy/prompt/confirm";
import { Number } from "@cliffy/prompt/number";

const result = await prompt([{
  name: "animals",
  message: `Select some animals`,
  type: Checkbox,
  options: ["dog", "cat", "snake"],
}, {
  name: "like",
  message: `Do you like animals?`,
  type: Confirm,
  after: async ({ like }, next) => { // executed after like prompt
    if (like) {
      await next(); // run age prompt
    } else {
      await next("like"); // run like prompt again
    }
  },
}, {
  name: "age",
  message: "How old are you?",
  type: Number,
  before: async ({ animals }, next) => { // executed before age prompt
    if (animals?.length === 3) {
      await next(); // run age prompt
    } else {
      await next("animals"); // begin from start
    }
  },
}]);

console.log(result);
