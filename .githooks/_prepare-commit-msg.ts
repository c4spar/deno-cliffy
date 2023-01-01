import * as hoipoiCapsule from "https://deno.land/x/hoipoi_capsule@v2.0.2/mod.ts";

const commitMessageTemplate = `{{type}}({{scope}}): {{summary}}

{{body}}`;

const typeQ = () =>
  hoipoiCapsule.userInterface.prompt.Select.prompt({
    message: "Select type.",
    search: true,
    options: [
      {
        name:
          "build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
        value: "build",
      },
      {
        name:
          "ci: Changes to our CI configuration files and scripts (examples: CircleCi, SauceLabs)",
        value: "ci",
      },
      { name: "docs: Documentation only changes", value: "Docs" },
      { name: "feat: A new feature", value: "Feat" },
      { name: "fix: A bug fix", value: "Fix:" },
      { name: "perf: A code change that improves performance", value: "Perf" },
      {
        name:
          "refactor: A code change that neither fixes a bug nor adds a feature",
        value: "refactor",
      },
      {
        name: "test: Adding missing tests or correcting existing tests",
        value: "test",
      },
    ],
  });

const scopeQ = () =>
  hoipoiCapsule.userInterface.prompt.Select.prompt({
    message: "Select scope.",
    search: true,
    options: [
      {
        name: "task",
        value: "task",
      },
      {
        name: "upgrade",
        value: "upgrade",
      },
      {
        name: "prompt",
        value: "prompt",
      },
      {
        name: "flags",
        value: "flags",
      },
      {
        name: "keycode",
        value: "keycode",
      },
      {
        name: "keypress",
        value: "keypress",
      },
      {
        name: "ci",
        value: "ci",
      },
      {
        name: "deno",
        value: "deno",
      },
      {
        name: "changelog",
        value: "changelog",
      },
      {
        name: "license",
        value: "license",
      },
      {
        name: "egg",
        value: "egg",
      },
    ],
  });

hoipoiCapsule.useCase.fillInCommitMessage.run({
  commitMessageTemplate,
  questionList: [
    {
      target: "type",
      q: typeQ,
    },
    {
      target: "scope",
      q: scopeQ,
    },
    {
      target: "summary",
      q: hoipoiCapsule.preset.fillInCommitMessage.conventionalcommits.qMap
        .summary,
    },
    {
      target: "body",
      q: hoipoiCapsule.preset.fillInCommitMessage.conventionalcommits.qMap.body,
    },
  ],
});
