import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";
import { parse } from "https://deno.land/std@0.192.0/yaml/mod.ts";
import { z } from "https://deno.land/x/zod@v3.20.5/mod.ts";

const getManager = async (manager: "npm" | "yarn" | "pnpm") => {
  try {
    await new Deno.Command(manager, { args: ["--version"] }).output();
    return manager;
  } catch {
    return "npm";
  }
};

const outDir = "./npm";

const eggSchema = z.object({
  version: z.string(),
  description: z.string(),
});

const egg = parse(await Deno.readTextFile("./egg.yaml"));

await emptyDir(outDir);

await build({
  entryPoints: ["./mod.ts"],
  outDir,
  shims: {
    deno: true,
    timers: true,
    undici: true,
  },
  packageManager: await getManager("pnpm"),
  typeCheck: "both",
  declaration: "separate",
  esModule: true,
  scriptModule: false,
  package: {
    ...eggSchema.parse(egg),

    name: "deno-cliffy",
    license: "MIT",

    repository: {
      type: "git",
      url: "git+https://github.com/c4spar/deno-cliffy.git",
    },
    bugs: {
      url: "https://github.com/c4spar/deno-cliffy/issues",
    },
    compilerOptions: {
      target: "ESNext",
      sourceMap: true,
    },
  },
  postBuild: async () => {
    await Deno.copyFile("LICENSE", "npm/LICENSE");
    await Deno.copyFile("README.md", "npm/README.md");
  },
});
