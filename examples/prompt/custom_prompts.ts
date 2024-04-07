#!/usr/bin/env -S deno run

import { BufReader } from "https://deno.land/std@0.221.0/io/buf_reader.ts";
import { tty } from "../../ansi/tty.ts";
import { Figures } from "../../prompt/_figures.ts";
import { prompt } from "../../prompt/prompt.ts";
import { Input } from "../../prompt/input.ts";

const result = await prompt([{
  name: "text",
  message: `Enter some text`,
  // build-in prompt
  type: Input,
}, {
  // @TODO: Fix custom prompt example.
  //   name: "customText",
  //   message: `Enter more text`,
  //   // using an object/method as custom prompt
  //   type: {
  //     async prompt(options: { message: string }): Promise<string> {
  //       const message = ` ? ${options.message} ${Figures.POINTER_SMALL} `;
  //       await Deno.stdout.write(new TextEncoder().encode(message));
  //
  //       const result = await new BufReader(Deno.stdin).readLine();
  //
  //       return result ? new TextDecoder().decode(result.line) : "";
  //     },
  //   },
  // }, {
  name: "customNumber",
  message: `Enter a number`,
  // using a class as custom prompt
  type: class CustomPrompt {
    static async prompt(
      options: { message: string },
      error?: string,
    ): Promise<number> {
      const message = ` ? ${options.message} ${Figures.POINTER_SMALL} `;
      await Deno.stdout.write(new TextEncoder().encode(message));

      if (error) {
        tty.cursorSave();
        await Deno.stdout.write(new TextEncoder().encode("\n " + error));
        tty.cursorRestore();
      }

      const readLineResult = await new BufReader(Deno.stdin).readLine();
      const result = Number(
        readLineResult ? new TextDecoder().decode(readLineResult.line) : null,
      );

      if (isNaN(result)) {
        tty.cursorLeft.cursorUp.eraseDown();
        return this.prompt(options, `${result} is not a number.`);
      }

      return result;
    }
  },
}]);

console.log(result);

// if ( result.foo ) {} // error: Property 'foo' does not exist
// if ( result.customText && isNaN( result.customText ) ) {} // error: Argument of type 'string' is not assignable to parameter of type 'number'.
// if ( result.customNumber && isNaN( result.customNumber ) ) {} // no error: customNumber is of type number
