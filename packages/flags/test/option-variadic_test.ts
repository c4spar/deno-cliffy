import { parseFlags } from '../lib/flags.ts';
import { IParseOptions, OptionType } from '../lib/types.ts';
import { assertEquals, assertThrows } from './lib/assert.ts';

const options = <IParseOptions>{
    stopEarly: false,
    allowEmpty: false,
    flags: [ {
        name: 'optional',
        aliases: [ 'o' ],
        type: OptionType.NUMBER,
        variadic: true,
        optionalValue: true
    }, {
        name: 'boolean',
        aliases: [ 'b' ],
        type: OptionType.BOOLEAN,
        variadic: true
    }, {
        name: 'string',
        aliases: [ 's' ],
        type: OptionType.STRING,
        variadic: true
    }, {
        name: 'number',
        aliases: [ 'n' ],
        type: OptionType.NUMBER,
        variadic: true
    }, {
        name: 'variadic-option',
        aliases: [ 'e' ],
        args: [ {
            type: OptionType.NUMBER,
            optionalValue: false
        }, {
            type: OptionType.STRING,
            optionalValue: false
        }, {
            type: OptionType.BOOLEAN,
            optionalValue: true,
            variadic: true
        } ]
    } ]
};

// Optional:

Deno.test( function flags_optionVariadic_optional() {

    const { flags, unknown, literal } = parseFlags( [ '-o' ], options );

    assertEquals( flags, { optional: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

// Boolean:

Deno.test( function flags_optionVariadic_boolean() {

    const { flags, unknown, literal } = parseFlags( [ '-b', '1', '0', 'true', 'false' ], options );

    assertEquals( flags, { boolean: [ true, false, true, false ] } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionVariadic_booleanInvalidValue() {

    assertThrows(
        () => parseFlags( [ '-b', '1', '0', 'true', 'false', '2' ], options ),
        Error,
        'Option --boolean must be of type boolean but got: 2'
    );
} );

// String:

Deno.test( function flags_optionVariadic_string() {

    const { flags, unknown, literal } = parseFlags( [ '-s', '1', '0', 'true', 'false' ], options );

    assertEquals( flags, { string: [ '1', '0', 'true', 'false' ] } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

// Number:

Deno.test( function flags_optionVariadic_number() {

    const { flags, unknown, literal } = parseFlags( [ '-n', '1', '0', '654', '1.2' ], options );

    assertEquals( flags, { number: [ 1, 0, 654, 1.2 ] } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionVariadic_numberInvalidValue() {

    assertThrows(
        () => parseFlags( [ '-n', '1', '0', '654', 'abc', '1,2' ], options ),
        Error,
        'Option --number must be of type number but got: abc'
    );
} );

// Exact:

Deno.test( function flags_optionVariadic_exact() {

    const { flags, unknown, literal } = parseFlags( [ '-e', '1', 'abc', '1' ], options );

    assertEquals( flags, { variadicOption: [ 1, 'abc', true ] } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionVariadic_exactInvalidValue() {

    assertThrows(
        () => parseFlags( [ '-e', 'abc', 'abc', '1' ], options ),
        Error,
        'Option --variadic-option must be of type number but got: abc'
    );
} );

Deno.test( function flags_optionVariadic_exactMissingValue() {

    assertThrows(
        () => parseFlags( [ '-e', '1' ], options ),
        Error,
        'Missing value for option: --variadic-option'
    );
} );

Deno.test( function flags_optionVariadic_exactLastOptional() {

    const { flags, unknown, literal } = parseFlags( [ '-e', '1', 'abc' ], options );

    assertEquals( flags, { variadicOption: [ 1, 'abc' ] } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionVariadic_exactLastOptionalVariadic() {

    const { flags, unknown, literal } = parseFlags( [ '-e', '1', 'abc', '1', '0', 'true', 'false' ], options );

    assertEquals( flags, { variadicOption: [ 1, 'abc', true, false, true, false ] } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

await Deno.runTests();
