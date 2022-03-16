import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

const cmd = new Command()
  .throwErrors()
  .allowEmpty(false)
  .option("-t, --type [value:string]", "description ...", {
    required: true,
    conflicts: ["video-type", "audio-type", "image-type"],
  })
  .option("-v, --video-type [value:string]", "description ...", {
    required: true,
    depends: ["audio-type", "image-type"],
    conflicts: ["type"],
  })
  .option("-a, --audio-type [value:string]", "description ...", {
    required: true,
    depends: ["video-type", "image-type"],
    conflicts: ["type"],
  })
  .option("-i, --image-type [value:string]", "description ...", {
    required: true,
    depends: ["video-type", "audio-type"],
    conflicts: ["type"],
  })
  .action(() => {});

Deno.test("command optionConflicts noArguments", async () => {
  await assertRejects(
    async () => {
      await cmd.parse([]);
    },
    Error,
    `Missing required option "--type".`,
  );
});

Deno.test("command optionConflicts type", async () => {
  const { options, args } = await cmd.parse(["-t", "value"]);

  assertEquals(options, { type: "value" });
  assertEquals(args, []);
});

Deno.test("command optionConflicts videoAudioImageType", async () => {
  const { options, args } = await cmd.parse(
    ["-v", "value", "-a", "value", "--image-type", "value"],
  );

  assertEquals(
    options,
    { videoType: "value", audioType: "value", imageType: "value" },
  );
  assertEquals(args, []);
});

Deno.test("command optionConflicts videoAudioImageType", async () => {
  await assertRejects(
    async () => {
      await cmd.parse(["-v", "value", "-a", "value"]);
    },
    Error,
    `Option "--video-type" depends on option "--image-type".`,
  );
});
