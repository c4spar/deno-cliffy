import { Command } from '../../lib/command.ts';
import { assertEquals, assertThrowsAsync } from '../lib/assert.ts';

const cmd = new Command()
    .throwErrors()
    .option( '-v, --video-type [value:string]', 'description ...', { requires: [ 'audio-type', 'image-type' ] } )
    .option( '-a, --audio-type [value:string]', 'description ...', { requires: [ 'video-type', 'image-type' ] } )
    .option( '-i, --image-type [value:string]', 'description ...', { requires: [ 'video-type', 'audio-type' ] } )
    .action( () => {} );

Deno.test( async function command_optionRequire_noArguments() {

    const { options, args } = await cmd.parse( [] );

    assertEquals( options, {} );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionRequire_videoAudioImageType() {

    const { options, args } = await cmd.parse( [ '-v', 'value', '-a', 'value', '--image-type', 'value' ] );

    assertEquals( options, { videoType: 'value', audioType: 'value', imageType: 'value' } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionRequire_videoType() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-v', 'value' ] );
    }, Error, 'Option --video-type depends on option: --audio-type' );
} );

Deno.test( async function command_optionRequire_audioType() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-a', 'value' ] );
    }, Error, 'Option --audio-type depends on option: --video-type' );
} );

Deno.test( async function command_optionRequire_imageType() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-i', 'value' ] );
    }, Error, 'Option --image-type depends on option: --video-type' );
} );

Deno.test( async function command_optionRequire_videoAudio() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-v', 'value', '-a', 'value' ] );
    }, Error, 'Option --video-type depends on option: --image-type' );
} );

Deno.test( async function command_optionRequire_audioVideo() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-a', 'value', '-v', 'value' ] );
    }, Error, 'Option --audio-type depends on option: --image-type' );
} );

Deno.test( async function command_optionRequire_imageVideo() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-i', 'value', '-v', 'value' ] );
    }, Error, 'Option --image-type depends on option: --audio-type' );
} );

await Deno.runTests();
