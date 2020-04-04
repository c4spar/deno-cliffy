import { parseFlags } from '../../lib/flags.ts';
import { IParseOptions } from '../../lib/types.ts';
import { assertEquals } from '../lib/assert.ts';

const options = <IParseOptions>{
    stopEarly: false,
    allowEmpty: false,
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ],
        value( value: string ): string[] {
            return [ value ];
        }
    }, {
        name: 'flag2',
        aliases: [ 'F' ]
    } ]
};

Deno.test( function flags_optionVariadic_optional() {

    const { flags, unknown, literal } = parseFlags( [ '-f', '1', '-F', '1' ], options );

    assertEquals( flags, { flag: [ '1' ], flag2: '1' } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );
