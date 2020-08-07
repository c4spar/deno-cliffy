import { assertThrows } from '../../../dev_deps.ts';
import { parseFlags } from '../../flags.ts';

Deno.test( 'flags allowEmpty enabled', () => {

    parseFlags( [], {
        allowEmpty: true,
        flags: [ {
            name: 'flag',
            aliases: [ 'f' ]
        } ]
    } );
} );

Deno.test( 'flags allowEmpty noFlags', () => {

    parseFlags( [], {
        allowEmpty: true,
        flags: []
    } );
} );

Deno.test( 'flags allowEmpty disabledNoFlags', () => {

    parseFlags( [], {
        allowEmpty: false,
        flags: []
    } );
} );

Deno.test( 'flags allowEmpty disabled', () => {

    assertThrows(
        () => parseFlags( [], {
            allowEmpty: false,
            flags: [ {
                name: 'flag',
                aliases: [ 'f' ]
            } ]
        } ),
        Error,
        'No arguments.'
    );
} );
