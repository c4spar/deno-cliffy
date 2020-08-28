import { assertEquals, assertThrowsAsync } from '../../../dev_deps.ts';
import { ITypeInfo } from '../../../flags/types.ts';
import { Command } from '../../command.ts';

function cmd() {
    return new Command()
        .throwErrors()
        .type( 'color', ( { label, name, type, value }: ITypeInfo ) => {
            if ( ![ 'red', 'blue', 'yellow' ].includes( value ) ) {
                throw new Error( `${ label } ${ name } must be a valid ${ type } but got: ${ value }` );
            }
        } )
        .arguments( '[foo:string] [bar:number] [baz:boolean] [color:color]' );
}

Deno.test( 'valid command argument types', async () => {
    const { args } = await cmd().parse( [ 'abc', '123', 'true', 'red' ] );
    assertEquals( args, [ 'abc', 123, true ] );
} );

Deno.test( 'invalid number command argument type', async () => {
    await assertThrowsAsync( async () => {
        await cmd().parse( [ 'abc', 'xyz', 'true', 'red' ] );
    }, Error, 'Argument bar must be of type number but got: xyz' );
} );

Deno.test( 'invalid boolean command argument type', async () => {
    await assertThrowsAsync( async () => {
        await cmd().parse( [ 'abc', '123', 'xyz', 'red' ] );
    }, Error, 'Argument baz must be of type boolean but got: xyz' );
} );

Deno.test( 'invalid custom command argument type', async () => {
    await assertThrowsAsync( async () => {
        await cmd().parse( [ 'abc', '123', 'true', 'xyz' ] );
    }, Error, 'Argument color must be a valid color but got: xyz' );
} );
