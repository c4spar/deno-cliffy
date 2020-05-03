import { parseFlags } from '../../lib/flags.ts';
import { IParseOptions } from '../../lib/types.ts';
import { OptionType } from '../../lib/types.ts';
import { assertEquals, assertThrows } from '../lib/assert.ts';

const options = <IParseOptions>{
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

Deno.test( 'flags optionStandalone flag', () => {

    const { flags, unknown, literal } = parseFlags( [ '-f' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( 'flags optionStandalone flagCombine', () => {

    assertThrows(
        () => parseFlags( [ '-f', '-a' ], options ),
        Error,
        'Option --flag cannot be combined with other options.'
    );
} );

Deno.test( 'flags optionStandalone flagCombineLong', () => {

    assertThrows(
        () => parseFlags( [ '--flag', '--all' ], options ),
        Error,
        'Option --flag cannot be combined with other options.'
    );
} );
