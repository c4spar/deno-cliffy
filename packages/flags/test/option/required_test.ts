import { parseFlags } from '../../lib/flags.ts';
import { IParseOptions, OptionType } from '../../lib/types.ts';
import { assertEquals, assertThrows } from '../lib/assert.ts';

const options = <IParseOptions>{
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ],
        type: OptionType.STRING,
        required: true
    } ]
};

Deno.test( 'flags optionRequired', () => {

    const { flags, unknown, literal } = parseFlags( [ '-f', 'value' ], options );

    assertEquals( flags, { flag: 'value' } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( 'flags optionRequired noArguments', () => {

    assertThrows(
        () => parseFlags( [], options ),
        Error,
        'Missing required option: --flag'
    );
} );
