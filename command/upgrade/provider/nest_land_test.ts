import { assert, assertEquals } from "@std/assert";
import {
  mockFetch,
  mockGlobalFetch,
  resetFetch,
  resetGlobalFetch,
} from "@c4spar/mock-fetch";
import { NestLandProvider } from "./nest_land.ts";

Deno.test("NestLandProvider", async (ctx) => {
  mockGlobalFetch();

  const provider = new NestLandProvider();

  await ctx.step({
    name: "should return registry url",
    fn() {
      assertEquals(
        provider.getRegistryUrl("foo", "1.0.0"),
        "https://x.nest.land/foo@1.0.0",
      );
    },
  });

  await ctx.step({
    name: "should return repository url",
    fn() {
      assertEquals(
        provider.getRepositoryUrl("foo"),
        "https://nest.land/package/foo",
      );
    },
  });

  await ctx.step({
    name: "should return versions",
    async fn() {
      mockFetch("https://nest.land/api/package-client", {
        body: JSON.stringify({
          body: {
            latestVersion: "1.0.1",
            packageUploadNames: ["foo@1.0.0", "foo@1.0.1"],
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
          body: {
            latestVersion: "1.0.1",
            packageUploadNames: ["foo@1.0.0", "foo@1.0.1"],
          },
        }),
      };

      mockFetch("https://nest.land/api/package-client", mock);
      const isOutdated = await provider.isOutdated("foo", "1.0.0", "latest");
      assert(isOutdated);

      mockFetch("https://nest.land/api/package-client", mock);
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
