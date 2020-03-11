import { parseFlags } from '../lib/flags.ts';
import { assertThrows } from './lib/assert.ts';

Deno.test( function flags_allowEmpty_enabled() {

    parseFlags( [], {
        allowEmpty: true,
        flags: [ {
            name: 'flag',
            aliases: [ 'f' ]
        } ]
    } );
} );

Deno.test( function flags_allowEmpty_noFlags() {

    parseFlags( [], {
        allowEmpty: true,
        flags: []
    } );
} );

Deno.test( function flags_allowEmpty_disabledNoFlags() {

    parseFlags( [], {
        allowEmpty: false,
        flags: []
    } );
} );

Deno.test( function flags_allowEmpty_disabled() {

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

await Deno.runTests();
