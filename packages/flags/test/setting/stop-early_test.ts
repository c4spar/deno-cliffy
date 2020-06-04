import { parseFlags } from '../../lib/flags.ts';
import { OptionType } from '../../lib/types.ts';
import { assertEquals, assertThrows } from '../lib/assert.ts';

Deno.test( 'flags stopEarly disable', () => {

    const { flags, unknown, literal } = parseFlags( [
        '-f', 'true', 'run', 'script-name', '--script-arg1', '--script-arg2', '--', '--literal-arg1', '--literal-arg2'
    ], {
        stopEarly: false,
        flags: [ {
            name: 'flag',
            aliases: [ 'f' ],
            type: OptionType.BOOLEAN
        }, {
            name: 'script-arg1',
            aliases: [ 's' ],
            type: OptionType.BOOLEAN
        }, {
            name: 'script-arg2',
            aliases: [ 'S' ],
            type: OptionType.BOOLEAN
        } ]
    } );

    assertEquals( flags, { flag: true, scriptArg1: true, scriptArg2: true } );
    assertEquals( unknown, [ 'run', 'script-name' ] );
    assertEquals( literal, [ '--literal-arg1', '--literal-arg2' ] );
} );

Deno.test( 'flags stopEarly enabled', () => {

    const { flags, unknown, literal } = parseFlags( [
        '-f', 'true', 'run', 'script-name', '--script-arg1', '--script-arg2', '--script-arg3', '--', '--literal-arg1', '--literal-arg2'
    ], {
        stopEarly: true,
        flags: [ {
            name: 'flag',
            aliases: [ 'f' ],
            type: OptionType.BOOLEAN
        }, {
            name: 'script-arg1',
            aliases: [ 's' ],
            type: OptionType.BOOLEAN
        }, {
            name: 'script-arg2',
            aliases: [ 'S' ],
            type: OptionType.BOOLEAN
        } ]
    } );

    assertEquals( flags, { flag: true } );
    assertEquals( unknown, [ 'run', 'script-name', '--script-arg1', '--script-arg2', '--script-arg3' ] );
    assertEquals( literal, [ '--literal-arg1', '--literal-arg2' ] );
} );

Deno.test( 'flags stopEarly unknown option', () => {

    assertThrows(
        () => parseFlags( [
            '-f', 'true', '-t', 'true', 'run', 'script-name', '--script-arg1', '--script-arg2', '--script-arg3', '--', '--literal-arg1', '--literal-arg2'
        ], {
            stopEarly: true,
            flags: [ {
                name: 'flag',
                aliases: [ 'f' ],
                type: OptionType.BOOLEAN
            }, {
                name: 'script-arg1',
                aliases: [ 's' ],
                type: OptionType.BOOLEAN
            }, {
                name: 'script-arg2',
                aliases: [ 'S' ],
                type: OptionType.BOOLEAN
            } ]
        } ),
        Error,
        'Unknown option: -t'
    );
} );
