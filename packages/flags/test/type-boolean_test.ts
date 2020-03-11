import { parseFlags } from '../lib/flags.ts';
import { OptionType } from '../lib/types.ts';
import { assertEquals, assertThrows } from './lib/assert.ts';

const options = {
    stopEarly: false,
    allowEmpty: false,
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ],
        type: OptionType.BOOLEAN,
        optionalValue: true,
        standalone: true
    } ]
};

Deno.test( function flags_typeBoolean_flag() {

    const { flags, unknown, literal } = parseFlags( [ '-f' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_flagLong() {

    const { flags, unknown, literal } = parseFlags( [ '--flag' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_flagTrue() {

    const { flags, unknown, literal } = parseFlags( [ '-f', 'true' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_flagLongTrue() {

    const { flags, unknown, literal } = parseFlags( [ '--flag', 'true' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_flagFalse() {

    const { flags, unknown, literal } = parseFlags( [ '-f', 'false' ], options );

    assertEquals( flags, { flag: false } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_flagLongFalseUnknown() {

    const { flags, unknown, literal } = parseFlags( [ '--flag', 'false', 'unknown' ], options );

    assertEquals( flags, { flag: false } );
    assertEquals( unknown, [ 'unknown' ] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_flagTrue() {

    const { flags, unknown, literal } = parseFlags( [ '-f', '1' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_flagLongTrue() {

    const { flags, unknown, literal } = parseFlags( [ '--flag', '1' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_flagFalse() {

    const { flags, unknown, literal } = parseFlags( [ '-f', '0' ], options );

    assertEquals( flags, { flag: false } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_flagLongFalseUnknown() {

    const { flags, unknown, literal } = parseFlags( [ '--flag', '0', 'unknown' ], options );

    assertEquals( flags, { flag: false } );
    assertEquals( unknown, [ 'unknown' ] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_noFlagUnknown() {

    const { flags, unknown, literal } = parseFlags( [ '--no-flag', 'unknown' ], options );

    assertEquals( flags, { flag: false } );
    assertEquals( unknown, [ 'unknown' ] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeBoolean_flagInvalidType() {

    assertThrows(
        () => parseFlags( [ '-f', 'unknown' ], options ),
        Error,
        'Option --flag must be of type boolean but got: unknown'
    );
} );

await Deno.runTests();
