import { encode } from 'https://deno.land/std@v0.52.0/encoding/utf8.ts';
import { blue, bold, dim, green, magenta, red, yellow } from 'https://deno.land/std@v0.52.0/fmt/colors.ts';
import { IFlagOptions, IFlags } from '../../flags/lib/types.ts';
import { Table } from '../../table/lib/table.ts';
import format from '../../x/format.ts';
import { BaseCommand } from '../lib/base-command.ts';
import { IArgumentDetails, IEnvVariable, IHelpCommand, IOption } from '../lib/types.ts';
import { CommandListType } from '../types/command-list.ts';

/**
 * Generates well formatted and colored help output for specified command.
 */
export class HelpCommand extends BaseCommand implements IHelpCommand {

    public constructor( protected parent: BaseCommand ) {

        super();

        this
            .type( 'command', new CommandListType( this.parent ) )
            .arguments( '[command:command]' )

            .description( 'Show this help or the help of a sub-command.' )

            .action( ( flags: IFlags, name?: string ) => {
                this.show( name );
                Deno.exit( 0 );
            } );
    }

    public show( name?: string ) {
        Deno.stdout.writeSync( encode( this.getHelp( name ) ) );
    }

    /**
     * Render help output.
     */
    public getHelp( name?: string ): string {

        const cmd: BaseCommand | undefined = name ? this.parent.getCommand( name, false ) : this.parent;

        if ( !cmd ) {
            throw this.error( new Error( `Sub-command not found: ${ name }` ) );
        }

        let output = '';
        const indent = 2;

        const renderHelp = () => {

            // Header
            renderLine();
            output += Table.from( getHeader() )
                .indent( indent )
                .padding( 1 )
                .toString();

            // Description
            if ( cmd.getDescription() ) {
                renderLabel( 'Description' );
                output += Table.from( getDescription() )
                    .indent( indent * 2 )
                    .maxCellWidth( 140 )
                    .padding( 1 )
                    .toString();
            }

            // Options
            if ( cmd.hasOptions() ) {
                renderLabel( 'Options' );
                output += Table.from( getOptions() )
                    .padding( [ 2, 2, 1, 2 ] )
                    .indent( indent * 2 )
                    .maxCellWidth( [ 60, 60, 80, 60 ] )
                    .toString();
            }

            // Commands
            if ( cmd.hasCommands( false ) ) {
                renderLabel( 'Commands' );
                output += Table.from( getCommands() )
                    .padding( [ 2, 2, 1, 2 ] )
                    .indent( indent * 2 )
                    .toString();
            }

            // Environment variables
            if ( cmd.hasEnvVars() ) {
                renderLabel( 'Environment variables' );
                output += Table.from( getEnvVars() )
                    .padding( 2 )
                    .indent( indent * 2 )
                    .toString();
            }

            // Examples
            if ( cmd.hasExamples() ) {
                renderLabel( 'Examples' );
                output += Table.from( getExamples() )
                    .padding( 1 )
                    .indent( indent * 2 )
                    .maxCellWidth( 150 )
                    .toString();
            }

            renderLine();
        };

        const renderLine = ( ...args: any[] ) => output += ( args.length ? ' '.repeat( indent ) + format( ...args ) : '' ) + '\n';

        const renderLabel = ( label: string ) => {
            renderLine();
            renderLine( bold( `${ label }:` ) );
            renderLine();
        };

        const getHeader = (): string[][] => {

            return [
                [ bold( 'Usage:' ), magenta( `${ cmd.getName() }${ cmd.getArgsDefinition() ? ' ' + cmd.getArgsDefinition() : '' }` ) ],
                [ bold( 'Version:' ), yellow( `v${ cmd.getVersion() }` ) ]
            ];
        };

        const getDescription = (): string[][] => {

            return [
                [ cmd.getDescription() ]
            ];
        };

        const getOptions = (): string[][] => {

            return [
                ...cmd.getOptions( false ).map( ( option: IOption ) => [
                    option.flags.split( /,? +/g ).map( flag => blue( flag ) ).join( ', ' ),
                    this.highlight( option.typeDefinition || '' ),
                    red( bold( '-' ) ),
                    option.description.split( '\n' ).shift() as string,
                    getHints( option )
                ] )
            ];
        };

        const getCommands = (): string[][] => {

            return [
                ...cmd.getCommands( false ).map( ( command: BaseCommand ) => [
                    [ command.getName(), ...command.getAliases() ].map( name => blue( name ) ).join( ', ' ),
                    this.highlight( command.getArgsDefinition() || '' ),
                    red( bold( '-' ) ),
                    command.getDescription().split( '\n' ).shift() as string
                ] )
            ];
        };

        const getEnvVars = (): string[][] => {

            return [
                ...cmd.getEnvVars().map( ( envVar: IEnvVariable ) => [
                    envVar.names.map( name => blue( name ) ).join( ', ' ),
                    this.highlightDetails( envVar.details ),
                    `${ red( bold( '-' ) ) } ${ envVar.description }`
                ] )
            ];
        };

        const getExamples = (): string[][] => {

            let first = true;
            const rows: string[][] = [];
            cmd.getExamples().map( example => {
                if ( !first ) {
                    rows.push( [] );
                }
                first = false;
                rows.push( [
                    dim( bold( `${ capitalize( example.name ) }:` ) ),
                    `\n${ example.description }`
                ] );
            } );

            return rows;
        };

        const getHints = ( option: IFlagOptions ): string => {
            const hints = [];

            option.required && hints.push( yellow( `required` ) );
            typeof option.default !== 'undefined' && hints.push( blue( bold( `Default: ` ) ) + blue( format( option.default ) ) );
            option.depends && option.depends.length && hints.push( red( bold( `depends: ` ) ) + option.depends.map( depends => red( depends ) ).join( ', ' ) );
            option.conflicts && option.conflicts.length && hints.push( red( bold( `conflicts: ` ) ) + option.conflicts.map( conflict => red( conflict ) ).join( ', ' ) );

            if ( hints.length ) {
                return `(${ hints.join( ', ' ) })`;
            }

            return '';
        };

        renderHelp();

        return output;
    }

    /**
     * Colorize argument type's.
     */
    protected highlight( type: string = '' ): string {

        if ( !type ) {
            return type;
        }

        return this.parseArgsDefinition( type ).map( ( arg: IArgumentDetails ) => this.highlightDetails( arg ) ).join( ' ' );
    }

    /**
     * Colorize argument type's.
     */
    protected highlightDetails( arg: IArgumentDetails ): string {

        let str = '';

        str += yellow( arg.optionalValue ? '[' : '<' );

        let name = '';
        name += arg.name;
        if ( arg.variadic ) {
            name += '...';
        }
        name = magenta( name );

        str += name;

        str += yellow( ':' );
        str += red( arg.type );

        if ( arg.list ) {
            str += green( '[]' );
        }

        str += yellow( arg.optionalValue ? ']' : '>' );

        return str;
    }
}

function capitalize( string: string ): string {
    if ( !string ) {
        return '';
    }
    return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}
