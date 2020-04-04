import { parseFlags } from '../../lib/flags.ts';
import { OptionType } from '../../lib/types.ts';
import { assertEquals, assertThrows } from '../lib/assert.ts';

const options = {
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ],
        type: OptionType.STRING,
        required: true
    } ]
};

Deno.test( function flags_optionRequired() {

    const { flags, unknown, literal } = parseFlags( [ '-f', 'value' ], options );

    assertEquals( flags, { flag: 'value' } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionRequired_noArguments() {

    assertThrows(
        () => parseFlags( [], options ),
        Error,
        'Missing required option: --flag'
    );
} );

await Deno.runTests();
