import { parseFlags } from '../lib/flags.ts';
import { OptionType } from '../lib/types.ts';
import { assertThrows } from './lib/assert.ts';

const options = {
    stopEarly: false,
    allowEmpty: false,
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ],
        type: OptionType.BOOLEAN,
        optionalValue: true
    } ]
};

Deno.test( function flags_optionDuplicate_flag() {

    assertThrows(
        () => parseFlags( [ '-f', '-f' ], options ),
        Error,
        'Duplicate option: -f'
    );
} );

Deno.test( function flags_optionDuplicate_flagLong() {

    assertThrows(
        () => parseFlags( [ '-f', '--flag' ], options ),
        Error,
        'Duplicate option: --flag'
    );
} );

Deno.test( function flags_optionDuplicate_flagTrueLongFalse() {

    assertThrows(
        () => parseFlags( [ '-f', 'true', '--flag', 'false' ], options ),
        Error,
        'Duplicate option: --flag'
    );
} );

Deno.test( function flags_optionDuplicate_flagTrueNoFlag() {

    assertThrows(
        () => parseFlags( [ '-f', 'true', '--no-flag' ], options ),
        Error,
        'Duplicate option: --no-flag'
    );
} );

Deno.test( function flags_optionDuplicate_flagTrueNoFlagTrue() {

    assertThrows(
        () => parseFlags( [ '-f', 'true', '--no-flag', 'true' ], options ),
        Error,
        'Duplicate option: --no-flag'
    );
} );

await Deno.runTests();
