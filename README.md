# Cliffy - Command line framework for Deno

A collection of modules for creating interactive command line tools.

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/c4spar/deno-cliffy?logo=github) ![GitHub Release Date](https://img.shields.io/github/release-date/c4spar/deno-cliffy?logo=github)

![Build Status](https://github.com/c4spar/deno-cliffy/workflows/ci/badge.svg?branch=master) ![Deno version](https://img.shields.io/badge/deno-v0.39.0|v0.40.0|v0.38.0-green?logo=deno) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/c4spar/deno-cliffy?logo=github) ![GitHub issues](https://img.shields.io/github/issues/c4spar/deno-cliffy?logo=github) ![GitHub licence](https://img.shields.io/github/license/c4spar/deno-cliffy?logo=github)

**Included modules:**

* **[table](packages/table/):** Render data in table structure with correct indentation and support for multi-line rows.

* **[flags](packages/flags/):** Parse command line arguments.

* **[command](packages/command/):** Create flexible command line interfaces with type checking, auto generated help and out of the box support for shell completions (inspired by [node.js's](http://nodejs.org) [commander.js](https://github.com/tj/commander.js/blob/master/Readme.md)).

**Todo's:**

* **prompt:** Create interactive prompts like: input, checkbox, list, etc...

* **console:** Run a sub-shell with auto-completion and auto-suggestion for a specific command.

* ...
