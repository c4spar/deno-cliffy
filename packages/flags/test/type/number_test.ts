import { parseFlags } from '../../lib/flags.ts';
import { IParseOptions } from '../../lib/types.ts';
import { OptionType } from '../../lib/types.ts';
import { assertEquals, assertThrows } from '../lib/assert.ts';

const optionalValueOptions = <IParseOptions>{
    stopEarly: false,
    allowEmpty: false,
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ],
        type: OptionType.NUMBER,
        optionalValue: true
    } ]
};

const requiredValueOptions = <IParseOptions>{
    stopEarly: false,
    allowEmpty: false,
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ],
        type: OptionType.NUMBER
    } ]
};

Deno.test( function flags_typeNumber_flag() {

    const { flags, unknown, literal } = parseFlags( [ '-f' ], optionalValueOptions );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeNumber_flagValue() {

    const { flags, unknown, literal } = parseFlags( [ '--flag', '123' ], optionalValueOptions );

    assertEquals( flags, { flag: 123 } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeNumber_flagValueUnknown() {

    const { flags, unknown, literal } = parseFlags( [ '-f', '456', 'unknown' ], optionalValueOptions );

    assertEquals( flags, { flag: 456 } );
    assertEquals( unknown, [ 'unknown' ] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeNumber_flagMissing() {

    assertThrows(
        () => parseFlags( [ '-f' ], requiredValueOptions ),
        Error,
        'Missing value for option: --flag'
    );
} );

Deno.test( function flags_typeNumber_flagInvalidType() {

    assertThrows(
        () => parseFlags( [ '-f', 'abc' ], requiredValueOptions ),
        Error,
        'Option --flag must be of type number but got: abc'
    );
} );

await Deno.runTests();
