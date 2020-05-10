# Cliffy - Command line framework for Deno

A collection of modules for creating interactive command line tools.

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github) ![GitHub Release Date](https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github)

![Build Status](https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master) ![Deno version](https://img.shields.io/badge/deno-v1.0.0%20rc2-green?logo=deno) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/c4spar/deno-cliffy?logo=github) ![GitHub issues](https://img.shields.io/github/issues/c4spar/deno-cliffy?logo=github) ![GitHub licence](https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github)

**Included modules:**

* **[ansi-escape](packages/ansi-escape/):** Show, hide and move cli cursor, erase output and scroll window.

* **[command](packages/command/):** Create flexible command line interfaces with type checking, auto generated help and out of the box support for shell completions (inspired by [node.js's](http://nodejs.org) [commander.js](https://github.com/tj/commander.js/blob/master/Readme.md)).

* **[flags](packages/flags/):** Parse command line arguments.

* **[keycode](packages/keycode/):** Parse ANSI key codes.

* **[prompt](packages/prompt/):** Create interactive prompts like: checkbox, confirm, input, number, select, etc...

* **[table](packages/table/):** Create cli table's with border, padding, nested table's, etc...

**Todo's:**

* **console:** Run a sub-shell with auto-completion and auto-suggestion for a specific command.

* ...
