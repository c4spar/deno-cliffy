import { assertSnapshot, describe, it } from "../../../dev_deps.ts";
import { runCommand } from "./utils.ts";

describe({
  name: "command integration",
  ignore: Deno.build.os !== "windows",
  fn() {
    it("should complete boolean arg", async (t) => {
      const output: string = await runCommand("completions complete boolean");
      await assertSnapshot(t, output);
    });
  
    it("should complete boolean arg from foo command", async (t) => {
      const output: string = await runCommand("completions complete boolean foo");
      await assertSnapshot(t, output);
    });
  
    it("should complete boolean arg from foo bar command", async (t) => {
      const output: string = await runCommand(
        "completions complete boolean foo bar",
      );
      await assertSnapshot(t, output);
    });
  
    it("should complete available commands for help command", async (t) => {
      const output: string = await runCommand(
        "completions complete command help",
      );
      await assertSnapshot(t, output);
    });
  
    it("should complete enum", async (t) => {
      const output: string = await runCommand("completions complete color");
      await assertSnapshot(t, output);
    });
  
    it("should generate bash completions", async (t) => {
      const output: string = await runCommand("completions bash");
      await assertSnapshot(t, output);
    });
  
    it("should generate fish completions", async (t) => {
      const output: string = await runCommand("completions fish");
      await assertSnapshot(t, output);
    });
  
    it("should generate zsh completions", async (t) => {
      const output: string = await runCommand("completions zsh");
      await assertSnapshot(t, output);
    });
  
    it("should output command help with help command", async (t) => {
      const output: string = await runCommand("help");
      await assertSnapshot(t, output);
    });
  
    it("should output sub-command help with help command", async (t) => {
      const output: string = await runCommand("help foo");
      await assertSnapshot(t, output);
    });
  
    it("should output short help with -h flag", async (t) => {
      const output: string = await runCommand("-h");
      await assertSnapshot(t, output);
    });
  
    it("should output long help with --help flag", async (t) => {
      const output: string = await runCommand("--help");
      await assertSnapshot(t, output);
    });
  
    it("should output short version with -V flag", async (t) => {
      const output: string = await runCommand("-h");
      await assertSnapshot(t, output);
    });
  
    it("should output long version with --version flag", async (t) => {
      const output: string = await runCommand("--help");
      await assertSnapshot(t, output);
    });
  }
});
