import { parseFlags } from '../../lib/flags.ts';
import { OptionType } from '../../lib/types.ts';
import { assertEquals, assertThrows } from '../lib/assert.ts';

const options = {
    stopEarly: false,
    allowEmpty: false,
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ],
        type: OptionType.BOOLEAN,
        standalone: true
    }, {
        name: 'all',
        aliases: [ 'a' ],
        type: OptionType.BOOLEAN
    } ]
};

Deno.test( function flags_optionStandalone_flag() {

    const { flags, unknown, literal } = parseFlags( [ '-f' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionStandalone_flagCombine() {

    assertThrows(
        () => parseFlags( [ '-f', '-a' ], options ),
        Error,
        'Option --flag cannot be combined with other options.'
    );
} );

Deno.test( function flags_optionStandalone_flagCombineLong() {

    assertThrows(
        () => parseFlags( [ '--flag', '--all' ], options ),
        Error,
        'Option --flag cannot be combined with other options.'
    );
} );

await Deno.runTests();
