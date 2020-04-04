import { parseFlags } from '../../lib/flags.ts';
import { IParseOptions } from '../../lib/types.ts';
import { OptionType } from '../../lib/types.ts';
import { assertEquals, assertThrows } from '../lib/assert.ts';

const options = <IParseOptions>{
    stopEarly: false,
    allowEmpty: false,
    flags: [ {
        name: 'flag',
        aliases: [ 'f', 'fl', 'flags' ],
        type: OptionType.BOOLEAN,
        optionalValue: true
    } ]
};

Deno.test( function flags_optionAliases_f() {

    const { flags, unknown, literal } = parseFlags( [ '-f' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionAliases_fl() {

    const { flags, unknown, literal } = parseFlags( [ '--fl' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionAliases_flag() {

    const { flags, unknown, literal } = parseFlags( [ '--flag' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionAliases_flags() {

    const { flags, unknown, literal } = parseFlags( [ '--flags' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionAliases_InvalidValue_f() {

    assertThrows(
        () => parseFlags( [ '-f', 'value' ], options ),
        Error,
        'Option --flag must be of type boolean but got: value'
    );
} );

Deno.test( function flags_optionAliases_InvalidValue_fl() {

    assertThrows(
        () => parseFlags( [ '--fl', 'value' ], options ),
        Error,
        'Option --flag must be of type boolean but got: value'
    );
} );

Deno.test( function flags_optionAliases_InvalidValue_flag() {

    assertThrows(
        () => parseFlags( [ '--flag', 'value' ], options ),
        Error,
        'Option --flag must be of type boolean but got: value'
    );
} );

Deno.test( function flags_optionAliases_InvalidValue_flags() {

    assertThrows(
        () => parseFlags( [ '--flags', 'value' ], options ),
        Error,
        'Option --flag must be of type boolean but got: value'
    );
} );

await Deno.runTests();
