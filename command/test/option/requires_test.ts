import { test } from "@cliffy/internal/testing/test";
import { assertEquals, assertRejects } from "@std/assert";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .option(
    "-v, --video-type [value:string]",
    "description ...",
    { depends: ["audio-type", "image-type"] },
  )
  .option(
    "-a, --audio-type [value:string]",
    "description ...",
    { depends: ["video-type", "image-type"] },
  )
  .option(
    "-i, --image-type [value:string]",
    "description ...",
    { depends: ["video-type", "audio-type"] },
  )
  .action(() => {});

test("command optionRequire videoAudioImageType", async () => {
  const { options, args } = await cmd.parse(
    ["-v", "value", "-a", "value", "--image-type", "value"],
  );

  assertEquals(
    options,
    { videoType: "value", audioType: "value", imageType: "value" },
  );
  assertEquals(args, []);
});

test("command optionRequire videoType", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-v", "value"]);
    },
    Error,
    `Option "--video-type" depends on option "--audio-type".`,
  );
});

test("command optionRequire audioType", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-a", "value"]);
    },
    Error,
    `Option "--audio-type" depends on option "--video-type".`,
  );
});

test("command optionRequire imageType", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-i", "value"]);
    },
    Error,
    `Option "--image-type" depends on option "--video-type".`,
  );
});

test("command optionRequire videoAudio", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-v", "value", "-a", "value"]);
    },
    Error,
    `Option "--video-type" depends on option "--image-type".`,
  );
});

test("command optionRequire audioVideo", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-a", "value", "-v", "value"]);
    },
    Error,
    `Option "--audio-type" depends on option "--image-type".`,
  );
});

test("command optionRequire imageVideo", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-i", "value", "-v", "value"]);
    },
    Error,
    `Option "--image-type" depends on option "--audio-type".`,
  );
});
