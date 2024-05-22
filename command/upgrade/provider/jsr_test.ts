import { assert, assertEquals } from "@std/assert";
import {
  mockFetch,
  mockGlobalFetch,
  resetFetch,
  resetGlobalFetch,
} from "@c4spar/mock-fetch";
import { JsrProvider } from "./jsr.ts";

Deno.test("JsrProvider", async (ctx) => {
  mockGlobalFetch();

  const provider = new JsrProvider({
    scope: "example",
  });

  await ctx.step({
    name: "should return registry url",
    fn() {
      assertEquals(
        provider.getRegistryUrl("foo", "1.0.0"),
        "jsr:@example/foo@1.0.0",
      );
    },
  });

  await ctx.step({
    name: "should return repository url",
    fn() {
      assertEquals(
        provider.getRepositoryUrl("foo"),
        "https://jsr.io/@example/foo",
      );
    },
  });

  await ctx.step({
    name: "should return versions",
    async fn() {
      mockFetch("https://jsr.io//@example/foo/meta.json", {
        body: JSON.stringify({
          latest: "1.0.1",
          versions: {
            "1.0.1": null,
            "1.0.0": null,
          },
        }),
      });
      const versions = await provider.getVersions("foo");

      assertEquals(versions, {
        latest: "1.0.1",
        versions: ["1.0.1", "1.0.0"],
      });

      resetFetch();
    },
  });

  await ctx.step({
    name: "should check if version is outdated",
    async fn() {
      const mock = {
        body: JSON.stringify({
          latest: "1.0.1",
          versions: {
            "1.0.1": null,
            "1.0.0": null,
          },
        }),
      };

      mockFetch("https://jsr.io//@example/foo/meta.json", mock);
      const isOutdated = await provider.isOutdated("foo", "1.0.0", "latest");
      assert(isOutdated);

      mockFetch("https://jsr.io//@example/foo/meta.json", mock);
      const isNotOutdated = !await provider.isOutdated(
        "foo",
        "1.0.1",
        "latest",
      );
      assert(isNotOutdated);

      resetFetch();
    },
  });

  resetGlobalFetch();
});
