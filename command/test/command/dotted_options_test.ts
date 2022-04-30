import { assertEquals, assertRejects } from "../../../dev_deps.ts";
import { Command } from "../../command.ts";

function cmd() {
  return new Command()
    .throwErrors()
    .option(
      "-b.a, --bitrate.audio, --audio-bitrate <bitrate:number>",
      "Audio bitrate",
      {
        depends: ["bitrate.video"],
      },
    )
    .option(
      "-b.v, --bitrate.video, --video-bitrate <bitrate:number>",
      "Video bitrate",
      {
        depends: ["bitrate.audio"],
      },
    )
    .action(() => {});
}

Deno.test("command: dotted short options", async () => {
  const { options, args, literal } = await cmd().parse(
    ["-b.a", "300", "-b.v", "900"],
  );

  assertEquals(options, { bitrate: { audio: 300, video: 900 } });
  assertEquals(args, []);
  assertEquals(literal, []);
});

Deno.test("command: dotted long options", async () => {
  const { options, args, literal } = await cmd().parse(
    ["--bitrate.audio", "300", "--bitrate.video", "900"],
  );

  assertEquals(options, { bitrate: { audio: 300, video: 900 } });
  assertEquals(args, []);
  assertEquals(literal, []);
});

Deno.test("command: dotted aliases", async () => {
  const { options, args, literal } = await cmd().parse(
    ["--audio-bitrate", "300", "--video-bitrate", "900"],
  );

  assertEquals(options, { bitrate: { audio: 300, video: 900 } });
  assertEquals(args, []);
  assertEquals(literal, []);
});

Deno.test("command: dotted aliases", async () => {
  await assertRejects(
    () => cmd().parse(["--audio-bitrate", "300"]),
    Error,
    `Option "--bitrate.audio" depends on option "--bitrate.video".`,
  );
});

Deno.test("command: dotted option with invalid value", async () => {
  await assertRejects(
    () => cmd().parse(["--bitrate.audio", "300", "--bitrate.video", "900k"]),
    Error,
    `Option "--bitrate.video" must be of type "number", but got "900k".`,
  );
});
