<h1 align="center">❯ Cliffy</h1>

<p align="center">
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Version" src="https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/releases">
    <img alt="Release date" src="https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github" />
  </a>
  <a href="https://deno.land/">
    <img alt="Deno version" src="https://img.shields.io/badge/deno-v1.0.1-green?logo=deno" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Build status" src="https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master" />
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/issues?q=is%3Aissue+is%3Aopen+label%3Amodule%3Acommand">
    <img alt="issues" src="https://img.shields.io/github/issues/c4spar/deno-cliffy?label=issues&logo=github">
  </a>
  <a href="https://github.com/c4spar/deno-cliffy/actions?query=workflow%3Aci">
    <img alt="Licence" src="https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github" />
  </a>
</p>

<p align="center">
  <b>Command line framework for Deno</b></br>
  <sub>>_ A collection of modules for creating interactive command line tools.<sub>
</p>

<p align="center" style="color: #856404; background-color: #fff3cd; border-color: #ffeeba; padding: .75rem 1.25rem; margin-bottom: 1rem; border-radius: .25rem;">
    <b>WARNING:</b> This project is still under development. Not all features are fully implemented and it's possible to get some breaking changes if you upgrade to a newer version. If you find a bug or have a feature request feel free to create an issue.
</p>

## Packages

* **[ansi-escape](packages/ansi-escape/):** Show, hide and move cli cursor, erase output and scroll window.

* **[command](packages/command/):** Create flexible command line interfaces with type checking, auto generated help and out of the box support for shell completions (inspired by [node.js's](http://nodejs.org) [commander.js](https://github.com/tj/commander.js/blob/master/Readme.md)).

* **[flags](packages/flags/):** Parse command line arguments.

* **[keycode](packages/keycode/):** Parse ANSI key codes.

* **[prompt](packages/prompt/):** Create interactive prompts like: checkbox, confirm, input, number, select, etc...

* **[table](packages/table/):** Create cli table's with border, padding, nested table's, etc...
