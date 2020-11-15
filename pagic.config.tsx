import { React } from "https://deno.land/x/pagic/mod.ts";

export default {
  theme: "docs",
  title: "Cliffy",
  description: "Command line framework for deno",
  github: "https://github.com/c4spar/deno-cliffy",
  plugins: ["sidebar", "prev_next"],
  include: [
    "**/README.md",
    "**/assets",
    "_layout.tsx",
    "docs/assets",
    "docs/fonts/cliffy.eot",
    "docs/fonts/cliffy.woff",
    "docs/fonts/cliffy.woff2",
    "docs/custom.css",
    "CONTRIBUTING.md",
    "LICENSE",
  ],
  md: {
    anchorLevel: [1, 2, 3, 4, 5, 6],
    tocLevel: [2, 3],
  },
  tools: {
    editOnGithub: false,
    backToTop: true,
  },
  head: (<>
    <link
      rel="icon"
      type="image/svg+xml"
      href="/docs/assets/favicon.svg"
      sizes="any"
    />
    <link rel="stylesheet" href="/docs/custom.css" />
  </>),
  nav: [
    {
      text: "AnsiEscape",
      link: "/ansi_escape/",
    },
    {
      text: "Command",
      link: "/command/",
    },
    {
      text: "Flags",
      link: "/flags/",
    },
    {
      text: "KeyCode",
      link: "/keycode/",
    },
    {
      text: "Prompt",
      link: "/prompt/",
    },
    {
      text: "Table",
      link: "/table/",
    },
    {
      text: "",
      link: "https://deno.land/x/cliffy",
      align: "right",
      target: "_blank",
    },
    {
      text: "",
      link: "https://nest.land/package/cliffy",
      align: "right",
      target: "_blank",
    },
  ],
  sidebar: {
    "/": [{
      title: "AnsiEscape",
      link: "ansi_escape/README.md",
    }, {
      title: "Command",
      link: "command/README.md",
    }, {
      title: "Flags",
      link: "flags/README.md",
    }, {
      title: "KeyCode",
      link: "keycode/README.md",
    }, {
      title: "Prompt",
      link: "prompt/README.md",
    }, {
      title: "Table",
      link: "table/README.md",
    }],
  },
};
