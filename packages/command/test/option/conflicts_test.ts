import { Command } from '../../lib/command.ts';
import { assertEquals, assertThrowsAsync } from '../lib/assert.ts';

const cmd = new Command()
    .throwErrors()
    .allowEmpty( false )
    .option( '-t, --type [value:string]', 'description ...', {
        required: true,
        conflicts: [ 'video-type', 'audio-type', 'image-type' ]
    } )
    .option( '-v, --video-type [value:string]', 'description ...', {
        required: true,
        requires: [ 'audio-type', 'image-type' ],
        conflicts: [ 'type' ]
    } )
    .option( '-a, --audio-type [value:string]', 'description ...', {
        required: true,
        requires: [ 'video-type', 'image-type' ],
        conflicts: [ 'type' ]
    } )
    .option( '-i, --image-type [value:string]', 'description ...', {
        required: true,
        requires: [ 'video-type', 'audio-type' ],
        conflicts: [ 'type' ]
    } )
    .action( () => {} );

Deno.test( async function command_optionConflicts_noArguments() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [] );
    }, Error, 'Missing required option: --type' );
} );

Deno.test( async function command_optionConflicts_type() {

    const { options, args } = await cmd.parse( [ '-t', 'value' ] );

    assertEquals( options, { type: 'value' } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionConflicts_videoAudioImageType() {

    const { options, args } = await cmd.parse( [ '-v', 'value', '-a', 'value', '--image-type', 'value' ] );

    assertEquals( options, { videoType: 'value', audioType: 'value', imageType: 'value' } );
    assertEquals( args, [] );
} );

Deno.test( async function command_optionConflicts_videoAudioImageType() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-v', 'value', '-a', 'value' ] );
    }, Error, 'Option --video-type depends on option: --image-type' );
} );

await Deno.runTests();
