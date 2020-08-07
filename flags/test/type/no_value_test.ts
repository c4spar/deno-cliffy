import { assertEquals } from '../../../dev_deps.ts';
import { parseFlags } from '../../flags.ts';
import { IParseOptions } from '../../types.ts';

const options = <IParseOptions>{
    flags: [ {
        name: 'flag',
        aliases: [ 'f' ]
    } ]
};

Deno.test( 'flags typeBoolean no value - short flag', () => {

    const { flags, unknown, literal } = parseFlags( [ '-f' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( 'flags typeBoolean no value - long flag', () => {

    const { flags, unknown, literal } = parseFlags( [ '--flag' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( 'flags typeBoolean no value - short flag - should fail with value', () => {

    const { flags, unknown, literal } = parseFlags( [ '-f', '123' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [ '123' ] );
    assertEquals( literal, [] );
} );

Deno.test( 'flags typeBoolean no value - long flag - should fail with value', () => {

    const { flags, unknown, literal } = parseFlags( [ '--flag', '123' ], options );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [ '123' ] );
    assertEquals( literal, [] );
} );
