import { assertThrowsAsync } from '../../../dev_deps.ts';
import { Command } from '../../command.ts';

const cmd = new Command()
    .throwErrors()
    .option( '-f, --flag [value:boolean]', 'description ...' )
    .action( () => {} );

Deno.test( 'command optionDuplicate flag', async () => {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', '-f', 'unknown' ] );
    }, Error, 'Duplicate option: -f' );
} );

Deno.test( 'command optionDuplicate flagLong', async () => {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', '--flag' ] );
    }, Error, 'Duplicate option: --flag' );
} );

Deno.test( 'command optionDuplicate flagTrueLongFalse', async () => {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', 'true', '--flag', 'false' ] );
    }, Error, 'Duplicate option: --flag' );
} );

Deno.test( 'command optionDuplicate flagTrueNoFlag', async () => {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', 'true', '--no-flag' ] );
    }, Error, 'Duplicate option: --no-flag' );
} );

Deno.test( 'command optionDuplicate flagTrueNoFlagTrue', async () => {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', 'true', '--no-flag', 'true' ] );
    }, Error, 'Duplicate option: --no-flag' );
} );
