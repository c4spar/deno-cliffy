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
      text: "Ansi",
      link: "/ansi/",
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
      text: "Keycode",
      link: "/keycode/",
    },
    {
      text: "Keypress",
      link: "/keypress/",
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
      text: "Ansi",
      link: "ansi/README.md",
    }, {
      text: "Command",
      link: "command/README.md",
    }, {
      text: "Flags",
      link: "flags/README.md",
    }, {
      text: "Keycode",
      link: "keycode/README.md",
    }, {
      text: "Keypress",
      link: "keypress/README.md",
    }, {
      text: "Prompt",
      link: "prompt/README.md",
    }, {
      text: "Table",
      link: "table/README.md",
    }],
  },
};
