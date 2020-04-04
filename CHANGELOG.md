# [v0.4.0](https://github.com/c4spar/deno-cli/compare/v0.3.0...v0.4.0) (Sat Apr 4 23:34:06 2020)

* feat: add support for deno v0.39.0 ([d828f0c](https://github.com/c4spar/deno-cli/commit/d828f0c))

### Features

* **command:** add zsh completions support ([9493d90](https://github.com/c4spar/deno-cli/commit/9493d90), [f54d3a2](https://github.com/c4spar/deno-cli/commit/f54d3a2))
* **command:** add `complete` sub-command to `completions` command ([fb63ec7](https://github.com/c4spar/deno-cli/commit/fb63ec7))
* **command:** add complete method for custom auto completions ([7d5d25e](https://github.com/c4spar/deno-cli/commit/7d5d25e), [9406a84](https://github.com/c4spar/deno-cli/commit/9406a84), [5ce209d](https://github.com/c4spar/deno-cli/commit/5ce209d))
* **command:** complete command names on help command ([5897be1](https://github.com/c4spar/deno-cli/commit/5897be1))
* **command:** add `action` type ([164585e](https://github.com/c4spar/deno-cli/commit/164585e))
* **command:** add `command` type ([2b9608c](https://github.com/c4spar/deno-cli/commit/2b9608c))
* **command:** add autocompletion for types ([16d5237](https://github.com/c4spar/deno-cli/commit/16d5237))
* **flags:** support method as option default value ([ce09421](https://github.com/c4spar/deno-cli/commit/ce09421))
* **table:** add `border` option ([a785164](https://github.com/c4spar/deno-cli/commit/a785164))

### Bug Fixes

* **flags:** fix default value ([0244b50](https://github.com/c4spar/deno-cli/commit/0244b50))

### Code Refactoring

* **command:** export default types ([34fcddd](https://github.com/c4spar/deno-cli/commit/34fcddd))
* **command:** make `complete` method in custom type class's optional. ([253cd74](https://github.com/c4spar/deno-cli/commit/253cd74))
* **command:** update `completions` description ([a3c5c72](https://github.com/c4spar/deno-cli/commit/a3c5c72))
* **flags:** refactor `validateFlags` method ([2b51730](https://github.com/c4spar/deno-cli/commit/2b51730))
* **flags:** refactor `getOptions` method ([3927c36](https://github.com/c4spar/deno-cli/commit/3927c36))

### Chore

* **license:** update copyright ([8264b1a](https://github.com/c4spar/deno-cli/commit/8264b1a))

### Unit/Integration Tests

* **command:** update sub-command test ([0939b6d](https://github.com/c4spar/deno-cli/commit/0939b6d))
* **command,flags:** don't call `Deno.runTests()` in test's ([57f3a34](https://github.com/c4spar/deno-cli/commit/57f3a34))
* **flags:** refactor test's ([cf97a15](https://github.com/c4spar/deno-cli/commit/cf97a15), [c021659](https://github.com/c4spar/deno-cli/commit/c021659))
* **flags:** add value test ([6e3bc57](https://github.com/c4spar/deno-cli/commit/6e3bc57))
* **flags:** add default value test ([2fbfd54](https://github.com/c4spar/deno-cli/commit/2fbfd54))
* **flags:** add collect test ([3c14011](https://github.com/c4spar/deno-cli/commit/3c14011))

### Documentation Updates

* **command:** update `README.md` ([c7ff502](https://github.com/c4spar/deno-cli/commit/c7ff502), [4eaed60](https://github.com/c4spar/deno-cli/commit/4eaed60))
* **command:** add custom type examples ([290d24d](https://github.com/c4spar/deno-cli/commit/290d24d))

### BREAKING CHANGES

* **command,flags:** rename `requires` option to `depends` ([c937466](https://github.com/c4spar/deno-cli/commit/c937466))

    To define depending options you have tu use the options `depends` instead of `requires` now.

* **command,flags:** call `parseValue` only if the flag has a value ([ab5ba30](https://github.com/c4spar/deno-cli/commit/ab5ba30))

    Change type of `value` param from `Type.parse()` method from `string | false` to `string`




# [v0.3.0](https://github.com/c4spar/deno-cli/compare/v0.2.0...v0.3.0) (Tue Mar 31 17:49:50 2020)

### Features

* add support for deno v0.38.0 ([80d7ba4](https://github.com/c4spar/deno-cli/commit/80d7ba4), [9824899](https://github.com/c4spar/deno-cli/commit/9824899), [26b58be](https://github.com/c4spar/deno-cli/commit/26b58be))
* **command:** add support for custom type class's ([7006a67](https://github.com/c4spar/deno-cli/commit/7006a67))
* **flags:** add `parse` and remove `types` option to simplify custom types ([d1bc510](https://github.com/c4spar/deno-cli/commit/d1bc510))

### Bug Fixes

* **command:** suppress `Missing argument(s)` error for standalone options ([47b162e](https://github.com/c4spar/deno-cli/commit/47b162e))
* **command:** fix `IArgumentDetails` and `IOption` interface ([52193e5](https://github.com/c4spar/deno-cli/commit/52193e5))

### Code Refactoring

* **command:** change type of commands from Array to Map ([52f7e1f](https://github.com/c4spar/deno-cli/commit/52f7e1f))
* **command:** refactor sub-command helper methods ([d6d1b05](https://github.com/c4spar/deno-cli/commit/d6d1b05))
* **command:** refactor internal args handling and add some args helper methods ([957347e](https://github.com/c4spar/deno-cli/commit/957347e))

### Documentation Updates

* update `README.md` ([bee4767](https://github.com/c4spar/deno-cli/commit/bee4767), [d779851](https://github.com/c4spar/deno-cli/commit/d779851), [063905d](https://github.com/c4spar/deno-cli/commit/063905d), [4fc534d](https://github.com/c4spar/deno-cli/commit/4fc534d))
* **flags:** update `README.md` ([3a9a2a4](https://github.com/c4spar/deno-cli/commit/3a9a2a4))



# [v0.2.0](https://github.com/c4spar/deno-cli/compare/v0.1.0...v0.2.0) (Mon Mar 23 00:36:36 2020)

### Features

* **command:** validate environment variables ([179ef30](https://github.com/c4spar/deno-cli/commit/179ef30))
* **command:** add support for custom types ([fbfea55](https://github.com/c4spar/deno-cli/commit/fbfea55))
* **flags:** add `parseFlagValue()` method ([1983bd1](https://github.com/c4spar/deno-cli/commit/1983bd1))

### Code Refactoring

* **command:** refactor `env()` method ([a1a3364](https://github.com/c4spar/deno-cli/commit/a1a3364))
* **command:** print help when the `completions` command is called without arguments ([b2c4f91](https://github.com/c4spar/deno-cli/commit/b2c4f91))
* **command:** update description of `completions` command ([5feeb77](https://github.com/c4spar/deno-cli/commit/5feeb77))
* **command:** update description of `help` command ([15a3fd5](https://github.com/c4spar/deno-cli/commit/15a3fd5))
* **command:** print only first line of description in options and command list ([8cf33a1](https://github.com/c4spar/deno-cli/commit/8cf33a1))
* **command:** exit program after help and version is printed ([05bc677](https://github.com/c4spar/deno-cli/commit/05bc677))
* **flags:** refactor `string` type ([6900462](https://github.com/c4spar/deno-cli/commit/6900462))
* **flags:** refactor `boolean` type ([10997f6](https://github.com/c4spar/deno-cli/commit/10997f6))
* **table:** refactor `table` method ([8228ac1](https://github.com/c4spar/deno-cli/commit/8228ac1))

### Documentation Updates

* **command:** add `README.md` ([e1d4b33](https://github.com/c4spar/deno-cli/commit/e1d4b33))
* **examples:** add examples ([d6917c7](https://github.com/c4spar/deno-cli/commit/d6917c7))
* **flags:** add `README.md` ([7c8a062](https://github.com/c4spar/deno-cli/commit/7c8a062))


# [v0.1.0](https://github.com/c4spar/deno-cli/compare/1031df6...v0.1.0) (2020-03-18)

* add entry points ([e86d44e](https://github.com/c4spar/deno-cli/commit/e86d44e))

### Features

* **command:** add `command` module ([3f95ec6](https://github.com/c4spar/deno-cli/commit/3f95ec6), [789faa3](https://github.com/c4spar/deno-cli/commit/789faa3), [bf3a20c](https://github.com/c4spar/deno-cli/commit/bf3a20c), [148c810](https://github.com/c4spar/deno-cli/commit/148c810), [d2faa96](https://github.com/c4spar/deno-cli/commit/d2faa96))
* **flags:** add `flags` module ([7eaab8b](https://github.com/c4spar/deno-cli/commit/7eaab8b))
* **table:** add `table` module ([e05aaa3](https://github.com/c4spar/deno-cli/commit/e05aaa3))

### Chore

* **ci:** add ci workflow ([410383a](https://github.com/c4spar/deno-cli/commit/410383a))
* **git:** add `.gitignore` ([bc704b4](https://github.com/c4spar/deno-cli/commit/bc704b4))

### Documentation Updates

* add `README.md` ([9a3d70c](https://github.com/c4spar/deno-cli/commit/9a3d70c), [4743c8b](https://github.com/c4spar/deno-cli/commit/4743c8b), [ca653ba](https://github.com/c4spar/deno-cli/commit/ca653ba), [54603d8](https://github.com/c4spar/deno-cli/commit/54603d8), [180eb3a](https://github.com/c4spar/deno-cli/commit/180eb3a), [f65941c](https://github.com/c4spar/deno-cli/commit/f65941c))
