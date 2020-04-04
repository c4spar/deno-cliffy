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
        type: OptionType.STRING,
        optionalValue: true
    } ]
};

const requiredValueOptions = <IParseOptions>{
    stopEarly: false,
    allowEmpty: false,
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ],
        type: OptionType.STRING
    } ]
};

Deno.test( function flags_typeString_flag() {

    const { flags, unknown, literal } = parseFlags( [ '-f' ], optionalValueOptions );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeString_flagValue() {

    const { flags, unknown, literal } = parseFlags( [ '--flag', 'value' ], optionalValueOptions );

    assertEquals( flags, { flag: 'value' } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeString_flagValueUnknown() {

    const { flags, unknown, literal } = parseFlags( [ '-f', '!"§$%&/()=?*+#=\\/@*-+,<😎>,.;:_-abc123€√', 'unknown' ], optionalValueOptions );

    assertEquals( flags, { flag: '!"§$%&/()=?*+#=\\/@*-+,<😎>,.;:_-abc123€√' } );
    assertEquals( unknown, [ 'unknown' ] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_typeString_flagMissing() {

    assertThrows(
        () => parseFlags( [ '-f' ], requiredValueOptions ),
        Error,
        'Missing value for option: --flag'
    );
} );

await Deno.runTests();
