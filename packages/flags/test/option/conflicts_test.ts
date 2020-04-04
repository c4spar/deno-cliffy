import { parseFlags } from '../../lib/flags.ts';
import { IParseOptions } from '../../lib/types.ts';
import { OptionType } from '../../lib/types.ts';
import { assertEquals, assertThrows } from '../lib/assert.ts';

const options = <IParseOptions>{
    allowEmpty: false,
    flags: [ {
        name: 'type',
        aliases: [ 't' ],
        type: OptionType.STRING,
        required: true,
        conflicts: [ 'video-type', 'audio-type', 'image-type' ]
    }, {
        name: 'video-type',
        aliases: [ 'v' ],
        type: OptionType.STRING,
        required: true,
        depends: [ 'audio-type', 'image-type' ],
        conflicts: [ 'type' ]
    }, {
        name: 'audio-type',
        aliases: [ 'a' ],
        type: OptionType.STRING,
        required: true,
        depends: [ 'video-type', 'image-type' ],
        conflicts: [ 'type' ]
    }, {
        name: 'image-type',
        aliases: [ 'i' ],
        type: OptionType.STRING,
        required: true,
        depends: [ 'video-type', 'audio-type' ],
        conflicts: [ 'type' ]
    } ]
};

Deno.test( function flags_optionConflicts_noArguments() {

    assertThrows(
        () => parseFlags( [], options ),
        Error,
        'Missing required option: --type'
    );
} );

Deno.test( function flags_optionConflicts_type() {

    const { flags, unknown, literal } = parseFlags( [ '-t', 'value' ], options );

    assertEquals( flags, { type: 'value' } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionConflicts_videoAudioImageType() {

    const { flags, unknown, literal } = parseFlags( [ '-v', 'value', '-a', 'value', '--image-type', 'value' ], options );

    assertEquals( flags, { videoType: 'value', audioType: 'value', imageType: 'value' } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionConflicts_videoTypeDependsOnImageType() {

    assertThrows(
        () => parseFlags( [ '-v', 'value', '-a', 'value' ], options ),
        Error,
        'Option --video-type depends on option: --image-type'
    );
} );

await Deno.runTests();
