# [v0.12.0](https://github.com/c4spar/deno-cli/compare/v0.11.2...v0.12.0) (2020-08-01)

### Features

* **table:** add support for `rowSpan` ([9c05cc3](https://github.com/c4spar/deno-cli/commit/9c05cc3))
* **table:** add support for `colSpan` ([bb6cae9](https://github.com/c4spar/deno-cli/commit/bb6cae9))
* **table:** add `.fromJson()` method ([4be3edd](https://github.com/c4spar/deno-cli/commit/4be3edd))
* **table:** add support for enabling and disabling border per row and cell ([d62182d](https://github.com/c4spar/deno-cli/commit/d62182d))
* **table:** add `.body()` method to `Table` ([2526ff2](https://github.com/c4spar/deno-cli/commit/2526ff2))
* **table:** make border chars customizable ([866b71e](https://github.com/c4spar/deno-cli/commit/866b71e))

### Bug Fixes

* **keycode:** `KeyCode.parse(data)` captures only the first character (#54) ([f153909](https://github.com/c4spar/deno-cli/commit/f153909))
* **prompt:** pasting clipboard into prompt returns corrupted data (#54) ([5de866c](https://github.com/c4spar/deno-cli/commit/5de866c))
* **prompt:** show option name instead of value as result with select and checkbox prompt (#53) ([1d81235](https://github.com/c4spar/deno-cli/commit/1d81235))
* **prompt:** cursor not visible after exiting with `ctrl + c` ([110a07e](https://github.com/c4spar/deno-cli/commit/110a07e))
* **table:** remove trailing line break from `.toString()` method ([3af8850](https://github.com/c4spar/deno-cli/commit/3af8850))

### Code Refactoring

* **table:** set default table padding to `1` ([a6e6aa3](https://github.com/c4spar/deno-cli/commit/a6e6aa3))
* **table:** reformat table ([16ae13d](https://github.com/c4spar/deno-cli/commit/16ae13d))
* **table:** add `TableLayout` class ([699c0d1](https://github.com/c4spar/deno-cli/commit/699c0d1))
* **table:** refactor `.from()` and `.clone()` method's ([ddee9d7](https://github.com/c4spar/deno-cli/commit/ddee9d7))

### Chore

* **ci:** update deno version to v1.2.2 ([3dd48e0](https://github.com/c4spar/deno-cli/commit/3dd48e0), [90f670a](https://github.com/c4spar/deno-cli/commit/90f670a))
* **nest:** update version to v0.12.0 ([6e212a2](https://github.com/c4spar/deno-cli/commit/6e212a2))
* **deno**: update deno/std version to v0.63.0 ([82c3eae](https://github.com/c4spar/deno-cli/commit/82c3eae), [adc84c4](https://github.com/c4spar/deno-cli/commit/adc84c4))

### Unit/Integration Tests

* **table:** add colspan and rowspan test's ([d8df570](https://github.com/c4spar/deno-cli/commit/d8df570))

### Documentation Updates

* fix license link ([96988d2](https://github.com/c4spar/deno-cli/commit/96988d2))
* **changelog:** fix changelog versions ([6e71754](https://github.com/c4spar/deno-cli/commit/6e71754))
* **keycode:** update keycode example ([ae01931](https://github.com/c4spar/deno-cli/commit/ae01931))
* **table:** update readme and examples ([e837b71](https://github.com/c4spar/deno-cli/commit/e837b71), [df18516](https://github.com/c4spar/deno-cli/commit/df18516))



# [v0.11.2](https://github.com/c4spar/deno-cli/compare/v0.11.1...v0.11.2) (2020-07-22)

### Features

* **prompt:** add support for custom keys ([5df1f95](https://github.com/c4spar/deno-cli/commit/5df1f95))

### Code Refactoring

* **prompt:** add fallback keys for unsupported keys on windows (#47) ([71f54f5](https://github.com/c4spar/deno-cli/commit/71f54f5))
* **prompt:** extend Toggle prompt from GenericPrompt (#50) ([cfe2064](https://github.com/c4spar/deno-cli/commit/cfe2064))



# [v0.11.1](https://github.com/c4spar/deno-cli/compare/v0.11.0...v0.11.1) (2020-07-15)

### Bug Fixes

* **prompt:** fix default value (#48) ([805f5a1](https://github.com/c4spar/deno-cli/commit/805f5a1))



# [v0.11.0](https://github.com/c4spar/deno-cli/compare/v0.10.0...v0.11.0) (2020-07-14)

### Features

* **command:** add `.versionOption()` and `.helpOption()` method's ([85d66b9](https://github.com/c4spar/deno-cli/commit/85d66b9))

### Code Refactoring

* remove `IGenericObject` interface ([e3c8660](https://github.com/c4spar/deno-cli/commit/e3c8660))
* **command:** remove `OptionType` type from `IArgumentDetails` ([c8dc229](https://github.com/c4spar/deno-cli/commit/c8dc229))
* **command:** refactor `ICommandOption` interface ([88263b5](https://github.com/c4spar/deno-cli/commit/88263b5))

### Chore

* **deno:** update deno/std to v0.61.0 and deno ci version to v1.2.0 (#45) ([f23da64](https://github.com/c4spar/deno-cli/commit/f23da64))
* **nest:** add `egg.yaml` config ([f8447cc](https://github.com/c4spar/deno-cli/commit/f8447cc))

### Unit/Integration Tests

* **command:** fix depends test ([9ec513c](https://github.com/c4spar/deno-cli/commit/9ec513c))

### Documentation Updates

* **command:** fix options type in action handler example's (#44) ([d661cc4](https://github.com/c4spar/deno-cli/commit/d661cc4))



# [v0.10.0](https://github.com/c4spar/deno-cli/compare/v0.9.0...v0.10.0) (2020-06-30)

### Breaking Changes

* **command:** remove `BaseCommand` class (#27) ([029aac5](https://github.com/c4spar/deno-cli/commit/029aac5), [2bc4660](https://github.com/c4spar/deno-cli/commit/2bc4660))

    All commands have to be created with the `Command` class for now.
    The `help` and `completions` commands are now optional and can be registered as descripted in the example below.
    The `--help` and `--version` option will be registered only on the main command for now. The `--help` option is a global option and available on all child-command's.
    
    ```typescript
    import { Command, HelpCommand, CompletionsCommand } from 'https://deno.land/x/cliffy/command.ts';
    
    await new Command()
        .command( 'help', new HelpCommand() )
        .command( 'completions', new CompletionsCommand() )
        .parse()
    ```

* **command:** remove optional argument from boolean flags which was registered per default (#40) ([94ea644](https://github.com/c4spar/deno-cli/commit/94ea644))

    An option defined with `.option('-d, --debug', '...')` has no longer an boolean argument per default.
    To add an boolean argument you have add the argument explicitly with `.option('-d, --debug [arg:boolean]', '...')`

* **flags:** remove optional argument from boolean flags which was registered per default (#40) ([00ac846](https://github.com/c4spar/deno-cli/commit/00ac846))

    A boolean flag no longer has an optional value per default. To add an optional or required value use the `optionalValue` or `requiredValue` option.

### Features

* **command:** add `prepend` option to `.option()` method ([5164692](https://github.com/c4spar/deno-cli/commit/5164692))
* **command:** add `.getGlobalParent()` method ([a1d61c9](https://github.com/c4spar/deno-cli/commit/a1d61c9))
* **command:** pass command to completion handler ([1e8d51b](https://github.com/c4spar/deno-cli/commit/1e8d51b))
* **command:** add support for function as description parameter ([8dfe004](https://github.com/c4spar/deno-cli/commit/8dfe004))
* **command:** add `.getParent()` and `.getMainCommand()` method's ([1a900be](https://github.com/c4spar/deno-cli/commit/1a900be))
* **command:** make executed command accessible with `this` in action handler (#28) ([461145f](https://github.com/c4spar/deno-cli/commit/461145f))
* **flags:** add support for shorthand flag's with value e.g. `-n5` results in `{n: 5}` but `-abc` will still result in `{a: true, b: true, c: true}` ([775c528](https://github.com/c4spar/deno-cli/commit/775c528))
* **flags:** add support for equal sign in flags e.g. `--foo=bar` ([53ba110](https://github.com/c4spar/deno-cli/commit/53ba110))

### Bug Fixes

* **command:** `getGlobal*` methods does not return all globals ([c7f5a5a](https://github.com/c4spar/deno-cli/commit/c7f5a5a))
* **prompt:** hide cursor in `Secret` prompt only if `hidden` is enabled ([5ebf343](https://github.com/c4spar/deno-cli/commit/5ebf343))

### Code Refactoring

* **command:** refactor help command ([6269e1b](https://github.com/c4spar/deno-cli/commit/6269e1b), [d3c2fa1](https://github.com/c4spar/deno-cli/commit/d3c2fa1))
* **command:** remove `DefaultCommand` class (#27) ([9e3913c](https://github.com/c4spar/deno-cli/commit/9e3913c), [9cdc2d2](https://github.com/c4spar/deno-cli/commit/9cdc2d2))
* **command:** make command properties private ([7d5e318](https://github.com/c4spar/deno-cli/commit/7d5e318))
* **command:** don't reset child commands with `.reset()` method ([ba85b2a](https://github.com/c4spar/deno-cli/commit/ba85b2a))
* **command:** refactor completions command ([5e07fff](https://github.com/c4spar/deno-cli/commit/5e07fff))
* **command:** add `ArgumentsParser` util class ([c30e474](https://github.com/c4spar/deno-cli/commit/c30e474))
* **command:** pass parent command to completion handler ([8e4167f](https://github.com/c4spar/deno-cli/commit/8e4167f))
* **command:** make `.complete()` method optional in custom type's ([53a9af7](https://github.com/c4spar/deno-cli/commit/53a9af7))
* **prompt:** remove generic options from `Select` prompt ([a694881](https://github.com/c4spar/deno-cli/commit/a694881))
* **prompt:** remove unused `Separator` class ([31b41e4](https://github.com/c4spar/deno-cli/commit/31b41e4))

### Chore

* **ci:** update deno version to v1.1.2 ([57741b0](https://github.com/c4spar/deno-cli/commit/57741b0), [5517a7e](https://github.com/c4spar/deno-cli/commit/5517a7e))

### Documentation Updates

* **command:** update readme and example's ([0918d76](https://github.com/c4spar/deno-cli/commit/0918d76), [9b76c92](https://github.com/c4spar/deno-cli/commit/9b76c92), [ae371d9](https://github.com/c4spar/deno-cli/commit/ae371d9), [fe9e06c](https://github.com/c4spar/deno-cli/commit/fe9e06c), [ddd8208](https://github.com/c4spar/deno-cli/commit/ddd8208))
* **flags:** update readme and example's ([5ed1ec7](https://github.com/c4spar/deno-cli/commit/5ed1ec7))
* **prompt:** update readme and example's ([edfae8b](https://github.com/c4spar/deno-cli/commit/edfae8b))




# [v0.9.0](https://github.com/c4spar/deno-cli/compare/v0.8.2...v0.9.0) (2020-06-05)

### Features

* **command:** implement `.stopEarly()` method (#39) ([45f28e7](https://github.com/c4spar/deno-cli/commit/45f28e7))
* **command:** add `.getRawArgs()` method ([4f18db7](https://github.com/c4spar/deno-cli/commit/4f18db7))
* **command:** return `literal` arguments in `.parse()` method and add `.getLiteralArgs()` method (#26) ([385f38f](https://github.com/c4spar/deno-cli/commit/385f38f))
* **flags:** implement `stopEarly` option (#39) ([ee683d3](https://github.com/c4spar/deno-cli/commit/ee683d3))
* **prompt:** add `minOptions` and `maxOptions` option's to `Checkbox` prompt (#38) ([0980b42](https://github.com/c4spar/deno-cli/commit/0980b42))
* **prompt:** add `minLength`, `maxLength`, `minTags` and `maxTags` option to `List` prompt (#37) ([6836a7d](https://github.com/c4spar/deno-cli/commit/6836a7d))
* **prompt:** add `label` option to `Secret` prompt ([9127471](https://github.com/c4spar/deno-cli/commit/9127471))
* **prompt:** add `minLength` and `maxLength` to `Input` and `Secret` prompt's (#36) ([2b13fab](https://github.com/c4spar/deno-cli/commit/2b13fab))
* **prompt:** add secret prompt (#35) ([9aaa740](https://github.com/c4spar/deno-cli/commit/9aaa740))

### Chore

* **ci:** update deno version to v1.0.5 ([bb2eb25](https://github.com/c4spar/deno-cli/commit/bb2eb25))



# [v0.8.2](https://github.com/c4spar/deno-cli/compare/v0.8.1...v0.8.2) (2020-05-30)

### Bug Fixes

* **table:** table fails if word is longer than maxCellWidth (#34) ([b6c5f07](https://github.com/c4spar/deno-cli/commit/b6c5f07))

### Code Refactoring

* **prompt:** remove `undefined` return type from `.prompt()` method's (#25) ([15f707a](https://github.com/c4spar/deno-cli/commit/15f707a))
* **table:** remove unused method ([6d00cc3](https://github.com/c4spar/deno-cli/commit/6d00cc3))



# [v0.8.1](https://github.com/c4spar/deno-cli/compare/v0.8.0...v0.8.1) (2020-05-29)

### Bug Fixes

* **prompt:** ignore ctrl and meta keys in input prompt's ([1f266b6](https://github.com/c4spar/deno-cli/commit/1f266b6))
* **prompt:** `c` character is not working in input prompt's ([a0d6545](https://github.com/c4spar/deno-cli/commit/a0d6545))



# [v0.8.0](https://github.com/c4spar/deno-cli/compare/v0.7.1...v0.8.0) (2020-05-29)

### Features

* **command:** add support for global and hidden environment variable's ([9e98940](https://github.com/c4spar/deno-cli/commit/9e98940))
* **command:** add support for global command's ([ec42c7a](https://github.com/c4spar/deno-cli/commit/ec42c7a))
* **command:** add support for global completion's ([1d814e2](https://github.com/c4spar/deno-cli/commit/1d814e2))
* **command:** add support for global type's ([91c1569](https://github.com/c4spar/deno-cli/commit/91c1569))
* **command:** add support for global option's (#2) ([7d6e7cf](https://github.com/c4spar/deno-cli/commit/7d6e7cf))
* **command:** make `args` parameter optional in `.parse()` method ([fabfd32](https://github.com/c4spar/deno-cli/commit/fabfd32))

### Code Refactoring

* **command:** remove `ICommandMap` interface ([eb3f578](https://github.com/c4spar/deno-cli/commit/eb3f578))



# [v0.7.1](https://github.com/c4spar/deno-cli/compare/v0.7.0...v0.7.1) (2020-05-24)

### Bug Fixes

* **command:** help command fails with registered environment variables (#31) ([b176bd4](https://github.com/c4spar/deno-cli/commit/b176bd4))

### Chore

* **ci:** test's in `packages/command/test/command` were not executed ([2436fd2](https://github.com/c4spar/deno-cli/commit/2436fd2))



# [v0.7.0](https://github.com/c4spar/deno-cli/compare/v0.6.1...v0.7.0) (2020-05-22)

### Features

* **command:** add support for hidden options's #23 ([42f701f](https://github.com/c4spar/deno-cli/commit/42f701f))
* **command:** add support for hidden command's #22 ([1866b75](https://github.com/c4spar/deno-cli/commit/1866b75))
* **command:** add `.getHelp()` method to `HelpCommand` ([9b96d10](https://github.com/c4spar/deno-cli/commit/9b96d10))
* **command:** add `.name()` method and refactor internal name and path handling (#21) ([362d8ea](https://github.com/c4spar/deno-cli/commit/362d8ea))
* **command:** make arguments generic ([8a153a7](https://github.com/c4spar/deno-cli/commit/8a153a7))
* **command,flags:** make options generic ([09a3d00](https://github.com/c4spar/deno-cli/commit/09a3d00))

### Bug Fixes

* **command:** environment variables are always invalid ([fa131eb](https://github.com/c4spar/deno-cli/commit/fa131eb))
* **command:** separator option is ignored ([0405244](https://github.com/c4spar/deno-cli/commit/0405244))
* **command:** default option incompatible with standalone option ([e9e6aa5](https://github.com/c4spar/deno-cli/commit/e9e6aa5))
* **command:** depends info is not shown in help output ([0e2e860](https://github.com/c4spar/deno-cli/commit/0e2e860))
* **command,keycode:** `CLIFFY_DEBUG` does not work ([4e90d77](https://github.com/c4spar/deno-cli/commit/4e90d77))
* **flags:** standalone option could be combined with options whose value is optional and has a default value ([5cd8287](https://github.com/c4spar/deno-cli/commit/5cd8287))
* **flags:** standalone option could be combined with another standalone option ([cb91b85](https://github.com/c4spar/deno-cli/commit/cb91b85))
* **keycode:** fix compile error which happened with deno v1.0.1 ([dcfa470](https://github.com/c4spar/deno-cli/commit/dcfa470))
* **keycode:** remove doublicate export of `IGenericObject` ([28fd483](https://github.com/c4spar/deno-cli/commit/28fd483))

### Code Refactoring

* use encoding/utf8 for text encoding ([81d4b04](https://github.com/c4spar/deno-cli/commit/81d4b04))

### Chore

* **ci:** fix typo ([33ca82c](https://github.com/c4spar/deno-cli/commit/33ca82c))
* **ci:** update deno version to v1.0.1 ([2f25d8b](https://github.com/c4spar/deno-cli/commit/2f25d8b), [fd98c80](https://github.com/c4spar/deno-cli/commit/fd98c80), [15f55ae](https://github.com/c4spar/deno-cli/commit/15f55ae))
* **deno:** update deno/std to v0.52.0 ([4b354cd](https://github.com/c4spar/deno-cli/commit/4b354cd))

### Documentation Updates

* fix issues link ([c64282e](https://github.com/c4spar/deno-cli/commit/c64282e))
* **command:** add executable example commands ([8fbe263](https://github.com/c4spar/deno-cli/commit/8fbe263))
* **command:** add documentation and example's for hidden command's and option's ([0c2f400](https://github.com/c4spar/deno-cli/commit/0c2f400))
* **command:** add generic types example and documentation ([0998f55](https://github.com/c4spar/deno-cli/commit/0998f55))
* **prompt:** fix prompt example ([90f8595](https://github.com/c4spar/deno-cli/commit/90f8595))

### BREAKING CHANGES

* **command:** rename `IFlagsParseResult` to `IParseResult` ([eaeb634](https://github.com/c4spar/deno-cli/commit/eaeb634))



# [v0.6.1](https://github.com/c4spar/deno-cli/compare/v0.6.0...v0.6.1) (2020-05-12)

### Bug Fixes

* add missing entry files and module exports for prompt & keycode module #19 ([f16863d](https://github.com/c4spar/deno-cli/commit/f16863d))



# [v0.6.0](https://github.com/c4spar/deno-cli/compare/v0.5.1...v0.6.0) (2020-05-11)

### Code Refactoring

* **command:** make command's executable without --allow-env flag #11 ([03117ed](https://github.com/c4spar/deno-cli/commit/03117ed))
* **x:** make format executable without --allow-env flag #11 ([2db057e](https://github.com/c4spar/deno-cli/commit/2db057e))

### Chore

* add support for deno v1.0.0-rc2 ([acb84e1](https://github.com/c4spar/deno-cli/commit/acb84e1))

### Documentation Updates

* update readme's ([7e549c9](https://github.com/c4spar/deno-cli/commit/7e549c9))

### BREAKING CHANGES

* **prompt:** prompt requires the --unstable flag to work with deno >= v0.42.0 ([6cd9d3f](https://github.com/c4spar/deno-cli/commit/6cd9d3f))



# [v0.5.1](https://github.com/c4spar/deno-cli/compare/v0.5.0...v0.5.1) (2020-05-03)

### Bug Fixes

* **flags:** default option incompatible with depends option and boolean flag's ([b76a9a7](https://github.com/c4spar/deno-cli/commit/b76a9a7))



# [v0.5.0](https://github.com/c4spar/deno-cli/compare/v0.4.0...v0.5.0) (2020-05-03)

### Features

* **ansi-escape:** add `ansi escape` module (#1) ([0ac92c2](https://github.com/c4spar/deno-cli/commit/0ac92c2))
* **keycode:** add `keycode` module ([f61d033](https://github.com/c4spar/deno-cli/commit/f61d033), [3be5b72](https://github.com/c4spar/deno-cli/commit/3be5b72), [9869720](https://github.com/c4spar/deno-cli/commit/9869720))
* **prompt:** add `prompt` module (#4) ([df2221e](https://github.com/c4spar/deno-cli/commit/df2221e))

### Code Refactoring

* use explicit version of deno std module's ([fcdf97a](https://github.com/c4spar/deno-cli/commit/fcdf97a))
* use utf8 encoding module instead of `TextEncoder` for text encoding ([b29e1ba](https://github.com/c4spar/deno-cli/commit/b29e1ba))
* **command:** use new `Table` class in help command ([5f203d1](https://github.com/c4spar/deno-cli/commit/5f203d1))

### Chore

* add support for deno v0.42.0 ([d860d3a](https://github.com/c4spar/deno-cli/commit/d860d3a), [db61141](https://github.com/c4spar/deno-cli/commit/db61141), [cddb7d1](https://github.com/c4spar/deno-cli/commit/cddb7d1), [83c767c](https://github.com/c4spar/deno-cli/commit/83c767c), [e0ff7b5](https://github.com/c4spar/deno-cli/commit/e0ff7b5), [c8af716](https://github.com/c4spar/deno-cli/commit/c8af716))

### Documentation Updates

* update `README.md` ([fcf1402](https://github.com/c4spar/deno-cli/commit/fcf1402))
* **command:** update `README.md` ([7434f79](https://github.com/c4spar/deno-cli/commit/7434f79))
* **table:** add table examples ([e7c1761](https://github.com/c4spar/deno-cli/commit/e7c1761))

### BREAKING CHANGES

* **table:** rewrite table module ([65988b7](https://github.com/c4spar/deno-cli/commit/65988b7))

    Old table method's like `table` and `renderTable` are replaced by the new `Table` class.




# [v0.4.0](https://github.com/c4spar/deno-cli/compare/v0.3.0...v0.4.0) (2020-04-04)

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

* add support for deno v0.39.0 ([d828f0c](https://github.com/c4spar/deno-cli/commit/d828f0c))
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




# [v0.3.0](https://github.com/c4spar/deno-cli/compare/v0.2.0...v0.3.0) (2020-03-31)

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



# [v0.2.0](https://github.com/c4spar/deno-cli/compare/v0.1.0...v0.2.0) (2020-03-23)

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
