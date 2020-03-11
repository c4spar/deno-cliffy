import { parseFlags } from '../lib/flags.ts';
import { OptionType } from '../lib/types.ts';
import { assertEquals, assertThrows } from './lib/assert.ts';

const options = {
    allowEmpty: true,
    flags: [ {
        name: 'video-type',
        aliases: [ 'v' ],
        type: OptionType.STRING,
        requires: [ 'audio-type', 'image-type' ]
    }, {
        name: 'audio-type',
        aliases: [ 'a' ],
        type: OptionType.STRING,
        requires: [ 'video-type', 'image-type' ]
    }, {
        name: 'image-type',
        aliases: [ 'i' ],
        type: OptionType.STRING,
        requires: [ 'video-type', 'audio-type' ]
    } ]
};

Deno.test( function flags_optionRequire_noArguments() {

    const { flags, unknown, literal } = parseFlags( [], options );

    assertEquals( flags, {} );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionRequire_videoAudioImageType() {

    const { flags, unknown, literal } = parseFlags( [ '-v', 'value', '-a', 'value', '--image-type', 'value' ], options );

    assertEquals( flags, { videoType: 'value', audioType: 'value', imageType: 'value' } );
    assertEquals( unknown, [] );
    assertEquals( literal, [] );
} );

Deno.test( function flags_optionRequire_videoType() {

    assertThrows(
        () => parseFlags( [ '-v', 'value' ], options ),
        Error,
        'Option --video-type depends on option: --audio-type'
    );
} );

Deno.test( function flags_optionRequire_audioType() {

    assertThrows(
        () => parseFlags( [ '-a', 'value' ], options ),
        Error,
        'Option --audio-type depends on option: --video-type'
    );
} );

Deno.test( function flags_optionRequire_imageType() {

    assertThrows(
        () => parseFlags( [ '-i', 'value' ], options ),
        Error,
        'Option --image-type depends on option: --video-type'
    );
} );

Deno.test( function flags_optionRequire_videoAudio() {

    assertThrows(
        () => parseFlags( [ '-v', 'value', '-a', 'value' ], options ),
        Error,
        'Option --video-type depends on option: --image-type'
    );
} );

Deno.test( function flags_optionRequire_audioVideo() {

    assertThrows(
        () => parseFlags( [ '-a', 'value', '-v', 'value' ], options ),
        Error,
        'Option --audio-type depends on option: --image-type'
    );
} );

Deno.test( function flags_optionRequire_imageVideo() {

    assertThrows(
        () => parseFlags( [ '-i', 'value', '-v', 'value' ], options ),
        Error,
        'Option --image-type depends on option: --audio-type'
    );
} );

await Deno.runTests();
