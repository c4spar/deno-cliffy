import { blue, bold, dim, green, magenta, red, yellow } from 'https://deno.land/std@v0.39.0/fmt/colors.ts';
import { IFlagOptions, IFlags } from '../../flags/lib/types.ts';
import { Table } from '../../table/lib/table.ts';
import format from '../../x/format.ts';
import { BaseCommand } from '../lib/base-command.ts';
import { CommandMap, IArgumentDetails, IEnvVariable, IHelpCommand, IOption } from '../lib/types.ts';
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

    /**
     * Render help output.
     */
    public show( name?: string ): void {

        const cmd: BaseCommand = name ? this.parent.getCommand( name ) : this.parent;

        const indent = 2;

        const renderHelp = () => {

            // Header
            renderLine();
            Table.from( getHeader() )
                 .indent( indent )
                 .padding( 1 )
                 .render();

            // Description
            if ( cmd.getDescription() ) {
                renderLabel( 'Description' );
                Table.from( getDescription() )
                     .indent( indent * 2 )
                     .maxCellWidth( 140 )
                     .padding( 1 )
                     .render();
            }

            // Options
            if ( cmd.hasOptions() ) {
                renderLabel( 'Options' );
                Table.from( getOptions() )
                     .padding( [ 2, 2, 1, 2 ] )
                     .indent( indent * 2 )
                     .maxCellWidth( [ 60, 60, 80, 60 ] )
                     .render();
            }

            // Commands
            if ( cmd.hasCommands() ) {
                renderLabel( 'Commands' );
                Table.from( getCommands() )
                     .padding( [ 2, 2, 1, 2 ] )
                     .indent( indent * 2 )
                     .render();
            }

            // Environment variables
            if ( cmd.hasEnvVars() ) {
                renderLabel( 'Environment variables' );
                Table.from( getEnvVars() )
                     .padding( 2 )
                     .indent( indent * 2 )
                     .render();
            }

            // Examples
            if ( cmd.hasExamples() ) {
                renderLabel( 'Examples' );
                Table.from( getExamples() )
                     .padding( 1 )
                     .indent( indent * 2 )
                     .maxCellWidth( 150 )
                     .render();
            }

            renderLine();
        };

        const renderLine = ( ...args: any[] ) => this.log( ...args );

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
                ...cmd.getOptions().map( ( option: IOption ) => [
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
                ...cmd.getCommandMaps().map( ( command: CommandMap ) => [
                    [ command.name, ...command.aliases ].map( name => blue( name ) ).join( ', ' ),
                    this.highlight( command.cmd.getArgsDefinition() || '' ),
                    red( bold( '-' ) ),
                    command.cmd.getDescription().split( '\n' ).shift() as string
                ] )
            ];
        };

        const getEnvVars = (): string[][] => {

            return [
                ...cmd.getEnvVars().map( ( envVar: IEnvVariable ) => [
                    envVar.names.map( name => blue( name ) ).join( ', ' ),
                    this.highlight( envVar.type ),
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
            if ( option.required || option.conflicts ) {
                option.required && hints.push( yellow( `required` ) );
                typeof option.default !== 'undefined' && hints.push( blue( bold( `Default: ` ) ) + blue( format( option.default ) ) );
                option.conflicts && hints.push( red( bold( `conflicts: ` ) ) + option.conflicts.map( conflict => red( conflict ) ).join( ', ' ) );
            }
            if ( hints.length ) {
                return `(${ hints.join( ', ' ) })`;
            }
            return '';
        };

        renderHelp();
    }

    /**
     * Colorize argument type's.
     */
    protected highlight( type: string = '' ): string {

        if ( !type ) {
            return type;
        }

        return this.parseArgsDefinition( type ).map( ( arg: IArgumentDetails ) => {

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

        } ).join( ' ' );
    }
}

function capitalize( string: string ): string {
    if ( !string ) {
        return '';
    }
    return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}
