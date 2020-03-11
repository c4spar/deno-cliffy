import { Command } from '../../lib/command.ts';
import { assertThrowsAsync } from '../lib/assert.ts';

const cmd = new Command()
    .throwErrors()
    .option( '-f, --flag [value:boolean]', 'description ...' )
    .action( () => {} );

Deno.test( async function command_optionDuplicate_flag() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', '-f', 'unknown' ] );
    }, Error, 'Duplicate option: -f' );
} );

Deno.test( async function command_optionDuplicate_flagLong() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', '--flag' ] );
    }, Error, 'Duplicate option: --flag' );
} );

Deno.test( async function command_optionDuplicate_flagTrueLongFalse() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', 'true', '--flag', 'false' ] );
    }, Error, 'Duplicate option: --flag' );
} );

Deno.test( async function command_optionDuplicate_flagTrueNoFlag() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', 'true', '--no-flag' ] );
    }, Error, 'Duplicate option: --no-flag' );
} );

Deno.test( async function command_optionDuplicate_flagTrueNoFlagTrue() {

    await assertThrowsAsync( async () => {
        await cmd.parse( [ '-f', 'true', '--no-flag', 'true' ] );
    }, Error, 'Duplicate option: --no-flag' );
} );

await Deno.runTests();
