import { assert, assertEquals } from "@std/assert";
import {
  mockFetch,
  mockGlobalFetch,
  resetFetch,
  resetGlobalFetch,
} from "@c4spar/mock-fetch";
import { GithubProvider } from "./github.ts";
import {
  mockCommand,
  mockGlobalCommand,
  resetCommand,
  resetGlobalCommand,
} from "@c4spar/mock-command";

Deno.test("GithubProvider", async (ctx) => {
  mockGlobalFetch();
  mockGlobalCommand();

  const provider = new GithubProvider({ repository: "repo/user" });

  await ctx.step({
    name: "should return registry url",
    fn() {
      assertEquals(
        provider.getRegistryUrl("foo", "1.0.0"),
        "https://raw.githubusercontent.com/repo/user/1.0.0",
      );
    },
  });

  await ctx.step({
    name: "should return repository url",
    fn() {
      assertEquals(
        provider.getRepositoryUrl("foo"),
        "https://github.com/repo/user",
      );
    },
  });

  await ctx.step({
    name: "should return versions",
    async fn() {
      mockFetch("https://api.github.com/repos/repo/user/git/refs/tags", {
        body: JSON.stringify([
          { ref: "1.0.0" },
          { ref: "1.0.1" },
        ]),
      });
      mockFetch("https://api.github.com/repos/repo/user/branches", {
        body: JSON.stringify([
          { name: "branch-1", protected: true },
          { name: "branch-2", protected: false },
        ]),
      });
      const versions = await provider.getVersions("foo");

      assertEquals(versions, {
        latest: "1.0.1",
        versions: [
          "1.0.1",
          "1.0.0",
          "branch-1 (\x1b[1mProtected\x1b[22m)",
          "branch-2 ",
        ],
        tags: [
          "1.0.1",
          "1.0.0",
        ],
        branches: [
          "branch-1 (\x1b[1mProtected\x1b[22m)",
          "branch-2 ",
        ],
      });

      resetFetch();
    },
  });

  await ctx.step({
    name: "should check if version is outdated",
    async fn() {
      const tagsMock = {
        body: JSON.stringify([
          { ref: "1.0.0" },
          { ref: "1.0.1" },
        ]),
      };
      const branchesMock = {
        body: JSON.stringify([
          { name: "branch-1", protected: true },
          { name: "branch-2", protected: false },
        ]),
      };

      mockFetch(
        "https://api.github.com/repos/repo/user/git/refs/tags",
        tagsMock,
      );
      mockFetch(
        "https://api.github.com/repos/repo/user/branches",
        branchesMock,
      );
      const isOutdated = await provider.isOutdated("foo", "1.0.0", "latest");
      assert(isOutdated);

      mockFetch(
        "https://api.github.com/repos/repo/user/git/refs/tags",
        tagsMock,
      );
      mockFetch(
        "https://api.github.com/repos/repo/user/branches",
        branchesMock,
      );
      const isNotOutdated = !await provider.isOutdated(
        "foo",
        "1.0.1",
        "latest",
      );
      assert(isNotOutdated);

      resetFetch();
    },
  });

  await ctx.step({
    name: "should upgrade to latest version",
    async fn() {
      mockFetch("https://api.github.com/repos/repo/user/git/refs/tags", {
        body: JSON.stringify([
          { ref: "1.0.0" },
          { ref: "1.0.1" },
        ]),
      });

      mockFetch("https://api.github.com/repos/repo/user/branches", {
        body: JSON.stringify([
          { name: "branch-1", protected: true },
          { name: "branch-2", protected: false },
        ]),
      });

      mockCommand({
        command: Deno.execPath(),
        args: [
          "install",
          "--no-check",
          "--quiet",
          "--force",
          "--name",
          "foo",
          "https://raw.githubusercontent.com/repo/user/1.0.1/foo.ts",
        ],
        stdout: "piped",
        stderr: "piped",
      });

      await provider.upgrade({
        name: "foo",
        from: "1.0.0",
        to: "latest",
      });

      resetFetch();
      resetCommand();
    },
  });

  resetGlobalFetch();
  resetGlobalCommand();
});
