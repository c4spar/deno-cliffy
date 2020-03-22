const { stdout, stderr } = Deno;
import { dim, red } from 'https://deno.land/std/fmt/colors.ts';
import { parseFlags } from '../../flags/lib/flags.ts';
import {
    IFlags,
    IFlagsResult,
    IFlagValue,
    IFlagValueHandler,
    IFlagValueType,
    OptionType
} from '../../flags/lib/types.ts';
import { fill } from '../../flags/lib/utils.ts';
import format from '../../x/format.ts';
import {
    CommandMap,
    IAction,
    IArgumentDetails,
    ICommandOption,
    IEnvVariable,
    IExample,
    IFlagsParseResult,
    IOption
} from './types.ts';

/**
 * Base command implementation without pre configured command's and option's.
 */
export class BaseCommand {

    protected rawArgs: string[] = [];
    protected name: string = location.pathname.split( '/' ).pop() as string;
    protected path: string = this.name;
    protected ver: string = '0.0.0';
    protected desc: string = 'No description ...';
    protected fn: IAction | undefined;
    protected options: IOption[] = [];
    protected commands: CommandMap[] = [];
    protected examples: IExample[] = [];
    protected envVars: IEnvVariable[] = [];
    protected cmd: BaseCommand = this;
    protected argsDefinition: string | undefined;
    protected isExecutable: boolean = false;
    protected throwOnError: boolean = false;
    protected cmdName: string | undefined;
    protected _allowEmpty: boolean = true;
    protected defaultCommand: string | undefined;
    protected _useRawArgs: boolean = false;

    /**
     * Add new sub-command.
     */
    public command( nameAndArguments: string, cmd?: BaseCommand | string, override?: boolean ): this {

        let executableDescription: string | undefined;

        if ( typeof cmd === 'string' ) {
            executableDescription = cmd;
            cmd = undefined;
        }

        const result = this.splitArguments( nameAndArguments );

        const name: string | undefined = result.args.shift();
        const aliases: string[] = result.args;

        if ( !name ) {
            throw this.error( new Error( 'Missing command name.' ) );
        }

        if ( this.getCommand( name ) ) {
            if ( !override ) {
                throw this.error( new Error( `Duplicate command: ${ name }` ) );
            }
            this.removeCommand( name );
        }

        const subCommand = ( cmd || new BaseCommand() ).reset();

        subCommand.name = name;
        subCommand.setPath( this.path );
        this.throwOnError && subCommand.throwErrors();

        if ( this.ver ) {
            subCommand.version( this.ver );
        }

        if ( executableDescription ) {
            subCommand.isExecutable = true;
            subCommand.description( executableDescription );
        }

        if ( result.typeDefinition ) {
            subCommand.arguments( result.typeDefinition );
        }

        this.commands.push( { name, cmd: subCommand, aliases } );

        this.select( name );

        return this;
    }

    /**
     * Add new command alias.
     *
     * @param alias Alias name
     */
    public alias( alias: string ): this {

        if ( !this.cmdName ) {
            throw this.error( new Error( `Failed to add alias '${ alias }'. No sub command selected.` ) );
        }

        if ( this.hasCommand( alias ) ) {
            throw this.error( new Error( `Duplicate alias: ${ alias }` ) );
        }

        this.getCommandMap( this.cmdName )?.aliases.push( alias );

        return this;
    }

    /**
     * Reset internal command reference to main command.
     */
    public reset(): this {
        this.cmd = this;
        this.getCommands().forEach( cmd => cmd.reset() );
        return this;
    }

    /**
     * Reset internal command reference to child command with given name.
     *
     * @param name Sub-command name.
     */
    public select( name: string ): this {

        const cmd = this.getCommand( name );

        if ( !cmd ) {
            throw this.error( new Error( `Sub-command not found: ${ name }` ) );
        }

        this.cmd = cmd;
        this.cmdName = name;

        return this;
    }

    /**
     * Execute help command.
     */
    public help() {

        this.getCommand( 'help' )?.execute( {} );
    }

    /********************************************************************************
     **** SUB HANDLER ***************************************************************
     ********************************************************************************/

    /**
     * Set command version.
     *
     * @param version Semantic version string.
     */
    public version( version: string ): this {
        this.cmd.ver = version;
        return this;
    }

    /**
     * Set command description.
     *
     * @param description Short command description.
     */
    public description( description: string ): this {
        this.cmd.desc = description;
        return this;
    }

    /**
     * Set command arguments.
     *
     * @param args Define required and optional commands like: <requiredArg:string> [optionalArg: number] [...restArgs:string]
     */
    public arguments( args: string ): this {
        this.cmd.argsDefinition = args;
        return this;
    }

    /**
     * Set command handler.
     *
     * @param fn Callback method.
     */
    public action( fn: IAction ): this {
        this.cmd.fn = fn;
        this.reset();
        return this;
    }

    /**
     * Don't throw an error if the command was called without arguments.
     *
     * @param allowEmpty
     */
    public allowEmpty( allowEmpty: boolean = true ): this {
        this.cmd._allowEmpty = allowEmpty;
        return this;
    }

    /**
     * Disable parsing arguments. If enabled the raw arguments will be passed to the action handler.
     * This has no effect for parent or child commands. Only for the command on which this method was called.
     */
    public useRawArgs( useRawArgs: boolean = true ): this {
        this.cmd._useRawArgs = useRawArgs;
        return this;
    }

    /**
     * Set default command. The default command will be called if no action handler is registered.
     */
    public default( name: string ): this {
        this.cmd.defaultCommand = name;
        return this;
    }

    /**
     * Throw error's instead of calling `Deno.exit()` to handle error's manually.
     * This has no effect for parent commands. Only for the command on which this method was called and all child commands.
     */
    public throwErrors(): this {
        this.cmd.throwOnError = true;
        this.getCommands().forEach( cmd => cmd.throwErrors() );
        return this;
    }

    /**
     * Add new option (flag).
     *
     * @param flags Flags string like: -h, --help, --manual <requiredArg:string> [optionalArg: number] [...restArgs:string]
     * @param desc Flag description.
     * @param value Custom handler for processing flag value.
     */
    public option( flags: string, desc: string, value?: IFlagValueHandler ): this;

    /**
     * Add new option (flag).
     *
     * @param flags Flags string like: -h, --help, --manual <requiredArg:string> [optionalArg: number] [...restArgs:string]
     * @param desc Flag description.
     * @param opts Flag options.
     */
    public option( flags: string, desc: string, opts?: ICommandOption ): this;
    public option( flags: string, desc: string, opts?: ICommandOption | IFlagValueHandler ): this {

        if ( typeof opts === 'function' ) {
            return this.option( flags, desc, { value: opts } );
        }

        const result = this.splitArguments( flags );

        if ( !result.typeDefinition ) {
            result.typeDefinition = '[value:boolean]';
        }

        const args: IArgumentDetails[] = result.typeDefinition ? this.parseArgsDefinition( result.typeDefinition ) : [];

        const option: IOption = {
            name: '',
            description: desc,
            args,
            flags: result.args.join( ', ' ),
            typeDefinition: result.typeDefinition || '[value:boolean]',
            ...opts
        };

        for ( const part of result.args ) {

            const arg = part.trim();
            const isLong = /^--/.test( arg );

            const name = isLong ? arg.slice( 2 ) : arg.slice( 1 );

            if ( option.name === name || option.aliases && ~option.aliases.indexOf( name ) ) {
                throw this.error( new Error( `Duplicate command name: ${ name }` ) );
            }

            if ( !option.name && isLong ) {
                option.name = name;
            } else if ( !option.aliases ) {
                option.aliases = [ name ];
            } else {
                option.aliases.push( name );
            }

            if ( this.cmd.getOption( name ) ) {
                if ( opts?.override ) {
                    this.removeOption( name );
                } else {
                    throw this.error( new Error( `Duplicate option name: ${ name }` ) );
                }
            }
        }

        this.cmd.options.push( option );

        return this;
    }

    /**
     * Add new command example.
     *
     * @param name          Name of the example.
     * @param description   The content of the example.
     */
    public example( name: string, description: string ): this {

        if ( this.cmd.hasExample( name ) ) {
            throw this.error( new Error( 'Example already exists.' ) );
        }

        this.cmd.examples.push( { name, description } );

        return this;
    }

    /**
     * Add new environment variable.
     *
     * @param name          Name of the environment variable.
     * @param description   The description of the environment variable.
     */
    public env( name: string, description: string ): this {

        const result = this.splitArguments( name );

        if ( !result.typeDefinition ) {
            result.typeDefinition = '<value:boolean>';
        }

        if ( result.args.some( envName => this.cmd.hasEnvVar( envName ) ) ) {
            throw this.error( new Error( `Environment variable already exists: ${ name }` ) );
        }

        const details = this.parseArgsDefinition( result.typeDefinition );

        if ( details.length > 1 ) {
            throw this.error( new Error( `An environment variable can only have one value but got: ${ name }` ) );
        } else if ( details.length && details[ 0 ].optionalValue ) {
            throw this.error( new Error( `An environment variable can not have an optional value but '${ name }' is defined as optional.` ) );
        } else if ( details.length && details[ 0 ].variadic ) {
            throw this.error( new Error( `An environment variable can not have an variadic value but '${ name }' is defined as variadic.` ) );
        }

        this.cmd.envVars.push( {
            names: result.args,
            description,
            type: result.typeDefinition,
            details: details.shift() as IArgumentDetails
        } );

        return this;
    }

    /********************************************************************************
     **** MAIN HANDLER **************************************************************
     ********************************************************************************/

    /**
     * Parse command line arguments and execute matched command.
     *
     * @param args Command line args to parse. Ex: `cmd.parse( Deno.args )`
     * @param dry Execute command after parsed.
     */
    public async parse( args: string[], dry?: boolean ): Promise<IFlagsParseResult> {

        this.reset();

        this.rawArgs = args;

        const subCommand = this.rawArgs.length && this.getCommand( this.rawArgs[ 0 ] );

        if ( subCommand ) {
            return await subCommand.parse( this.rawArgs.slice( 1 ), dry );
        }

        if ( this.isExecutable ) {

            if ( !dry ) {
                await this.executeExecutable( this.rawArgs );
            }

            return { options: {}, args: this.rawArgs, cmd: this };

        } else if ( this._useRawArgs ) {

            if ( dry ) {
                return { options: {}, args: this.rawArgs, cmd: this };
            }

            return await this.execute( {}, ...this.rawArgs );

        } else {

            const { flags, unknown } = this.parseFlags( this.rawArgs, true );

            const params = this.parseArguments( unknown );

            if ( dry ) {
                return { options: flags, args: params, cmd: this };
            }

            return await this.execute( flags, ...params );
        }
    }

    /**
     * Execute command.
     *
     * @param options A map of options.
     * @param args Command arguments.
     */
    protected async execute( options: IFlags, ...args: IFlagValue[] ): Promise<IFlagsParseResult> {

        const actionOption = this.findActionFlag( options, args );

        if ( actionOption && actionOption.action ) {
            await actionOption.action( options, ...args );
            return { options, args, cmd: this };
        }

        if ( this.fn ) {

            try {
                await this.fn( options, ...args );
            } catch ( e ) {
                throw this.error( e );
            }

        } else if ( this.defaultCommand ) {

            const defaultCommand = this.getCommand( this.defaultCommand );

            if ( !defaultCommand ) {
                throw this.error( new Error( `Default command '${ this.defaultCommand }' not found.` ) );
            }

            try {
                await defaultCommand.execute( options, ...args );
            } catch ( e ) {
                throw this.error( e );
            }
        }

        return { options, args, cmd: this };
    }

    /**
     * Execute external sub-command.
     *
     * @param args Raw command line arguments.
     */
    protected async executeExecutable( args: string[] ) {

        const [ main, ...names ] = this.path.split( ' ' );

        names.unshift( main.replace( /\.ts$/, '' ) );

        const executable = names.join( '-' );

        try {
            await Deno.run( {
                args: [ executable, ...args ]
            } );
            return;
        } catch ( e ) {
            if ( !e.message.match( /No such file or directory/ ) ) {
                throw e;
            }
        }

        try {
            await Deno.run( {
                args: [ executable + '.ts', ...args ]
            } );
            return;
        } catch ( e ) {
            if ( !e.message.match( /No such file or directory/ ) ) {
                throw e;
            }
        }

        throw this.error( new Error( `Sub-command executable not found: ${ executable }${ dim( '(.ts)' ) }` ) );
    }

    /**
     * Parse command line args.
     *
     * @param args          Command line args.
     * @param stopEarly     Stop early.
     * @param knownFlaks    Known command line args.
     */
    protected parseFlags( args: string[], stopEarly?: boolean, knownFlaks?: IFlags ): IFlagsResult {

        try {
            return parseFlags( args, {
                stopEarly,
                allowEmpty: this._allowEmpty,
                flags: this.options,
                knownFlaks
            } );
        } catch ( e ) {
            throw this.error( e );
        }
    }

    /**
     * Split arguments string into args and types: -v, --verbose [arg:boolean]
     *
     * @param args Arguments definition.
     */
    protected splitArguments( args: string ) {

        const parts = args.trim().split( /[, =] */g );
        const typeParts = [];

        while ( parts[ parts.length - 1 ] && parts[ parts.length - 1 ].match( /^[<\[].+[\]>]$/ ) ) {
            typeParts.unshift( parts.pop() );
        }

        const typeDefinition: string | undefined = typeParts.join( ' ' ) || undefined;

        return { args: parts, typeDefinition };
    }

    /**
     * Match commands and arguments from command line arguments.
     *
     * @param args
     */
    protected parseArguments( args: string[] ): IFlagValue[] {

        const expectedArgs: IArgumentDetails[] = this.argsDefinition ? this.parseArgsDefinition( this.argsDefinition ) : [];

        const params: IFlagValue[] = [];

        // remove array reference
        args = args.slice( 0 );

        if ( !expectedArgs.length ) {

            if ( args.length ) {
                if ( this.hasCommands() ) {
                    throw this.error( new Error( `Unknown command: ${ args.join( ' ' ) }` ) );
                } else {
                    throw this.error( new Error( `No arguments allowed for command: ${ this.name }` ) );
                }
            }

        } else {

            if ( !args.length ) {

                const required = expectedArgs.filter( expectedArg => !expectedArg.optionalValue )
                                             .map( expectedArg => expectedArg.name );

                if ( required.length ) {
                    throw this.error( new Error( 'Missing argument(s): ' + required.join( ', ' ) ) );
                }

                return params;
            }

            for ( const expectedArg of expectedArgs ) {

                if ( !expectedArg.optionalValue && !args.length ) {
                    throw this.error( new Error( `Missing argument: ${ expectedArg.name }` ) );
                }

                let arg: IFlagValue;

                if ( expectedArg.variadic ) {
                    arg = args.splice( 0, args.length ) as IFlagValueType[];
                } else {
                    arg = args.shift() as IFlagValue;
                }

                if ( arg ) {
                    params.push( arg );
                }
            }

            if ( args.length ) {
                throw this.error( new Error( `To many arguments: ${ args.join( ' ' ) }` ) );
            }
        }

        return params;
    }

    /**
     * Parse command line args definition.
     *
     * @param argsDefinition Arguments definition: <arg1:string> [arg2:number]
     */
    protected parseArgsDefinition( argsDefinition: string ): IArgumentDetails[] {

        const args: IArgumentDetails[] = [];

        let hasOptional = false;
        let hasVariadic = false;
        const parts: string[] = argsDefinition.split( / +/ );

        for ( const arg of parts ) {

            if ( hasVariadic ) {
                throw this.error( new Error( 'An argument can not follow an variadic argument.' ) );
            }

            const parts: string[] = arg.split( /[<\[:>\]]/ );
            const type: OptionType | string | undefined = parts[ 2 ] ? parts[ 2 ] : OptionType.STRING;

            let details: IArgumentDetails = {
                optionalValue: arg[ 0 ] !== '<',
                name: parts[ 1 ],
                variadic: false,
                list: type ? arg.indexOf( type + '[]' ) !== -1 : undefined,
                type
            };

            if ( !details.optionalValue && hasOptional ) {
                throw this.error( new Error( 'An required argument can not follow an optional argument.' ) );
            }

            if ( arg[ 0 ] === '[' ) {
                hasOptional = true;
            }

            if ( details.name.length > 3 ) {

                const istVariadicLeft = details.name.slice( 0, 3 ) === '...';
                const istVariadicRight = details.name.slice( -3 ) === '...';

                hasVariadic = details.variadic = istVariadicLeft || istVariadicRight;

                if ( istVariadicLeft ) {
                    details.name = details.name.slice( 3 );
                } else if ( istVariadicRight ) {
                    details.name = details.name.slice( 0, -3 );
                }
            }

            if ( details.name ) {
                args.push( details );
            }
        }

        return args;
    }

    /**
     * Execute help command if help flag is set.
     *
     * @param flags Command options.
     * @param args Command arguments.
     */
    protected findActionFlag( flags: IFlags, args: IFlagValue[] ): IOption | undefined {

        const flagNames = Object.keys( flags );

        for ( const flag of flagNames ) {

            const option = this.getOption( flag );

            if ( option?.action ) {
                return option;
            }
        }
    }

    /********************************************************************************
     **** GETTER ********************************************************************
     ********************************************************************************/

    /**
     * Get command name.
     */
    public getName(): string {

        return this.name;
    }

    /**
     * Get full command path of all parent command names's and current command name.
     */
    public getPath(): string {

        return this.path;
    }

    /**
     * Set command path.
     *
     * @param path Command path.
     */
    public setPath( path: string ): this {

        this.path = `${ path } ${ this.name }`;

        this.getCommands().forEach( command => command.setPath( this.path ) );

        return this;
    }

    /**
     * Get arguments definition.
     */
    public getArgsDefinition(): string | undefined {

        return this.argsDefinition;
    }

    /**
     * Get command arguments.
     */
    public getVersion(): string {

        return this.ver;
    }

    /**
     * Get command description.
     */
    public getDescription(): string {

        return this.desc;
    }

    /**
     * Checks whether the command has options or not.
     */
    public hasOptions(): boolean {

        return this.options.length > 0;
    }

    public getOptions(): IOption[] {

        return this.options;
    }

    /**
     * Checks whether the command has an option with given name not.
     */
    public hasOption( name: string ): boolean {

        return !!this.getOption( name );
    }

    /**
     * Get option by name.
     *
     * @param name Name of the option. Must be in param-case.
     */
    public getOption( name: string ): IOption | undefined {

        return this.options.find( option => option.name === name );
    }

    /**
     * Remove option by name.
     *
     * @param name Name of the option. Must be in param-case.
     */
    public removeOption( name: string ): IOption | undefined {

        const index = this.options.findIndex( option => option.name === name );

        if ( index === -1 ) {
            return;
        }

        return this.options.splice( index, 1 )[ 0 ];
    }

    /**
     * Checks whether the command has sub-commands or not.
     */
    public hasCommands(): boolean {

        return this.commands.length > 0;
    }

    /**
     * Get sub-command maps.
     */
    public getCommandMaps(): CommandMap[] {

        return this.commands;
    }

    /**
     * Get sub-commands.
     */
    public getCommands(): BaseCommand[] {

        return this.commands.map( cmd => cmd.cmd );
    }

    /**
     * Checks whether the command has a sub-command with given name or not.
     *
     * @param name Name of the command.
     */
    public hasCommand( name: string ): boolean {

        return !!this.getCommand( name );
    }

    /**
     * Get sub-command with given name.
     *
     * @param name Name of the sub-command.
     */
    public getCommand( name: string ): BaseCommand | undefined {

        return this.getCommandMap( name )?.cmd;
    }

    /**
     * Get sub-command map with given name.
     *
     * @param name Name of the sub-command.
     */
    public getCommandMap( name: string ): CommandMap | undefined {

        return this.commands.find( command =>
            command.name === name || command.aliases.indexOf( name ) !== -1 );
    }

    /**
     * Remove sub-command with given name.
     *
     * @param name Name of the command.
     */
    public removeCommand( name: string ): BaseCommand | undefined {

        const index = this.commands.findIndex( command => command.name === name );

        if ( index === -1 ) {
            return;
        }

        return this.commands.splice( index, 1 )[ 0 ].cmd;
    }

    /**
     * Checks whether the command has environment variables or not.
     */
    public hasEnvVars(): boolean {

        return this.envVars.length > 0;
    }

    /**
     * Get environment variables.
     */
    public getEnvVars(): IEnvVariable[] {

        return this.envVars;
    }

    /**
     * Checks whether the command has an environment variable with given name or not.
     *
     * @param name Name of the environment variable.
     */
    public hasEnvVar( name: string ): boolean {

        return !!this.getEnvVar( name );
    }

    /**
     * Get environment variable with given name.
     *
     * @param name Name of the example.
     */
    public getEnvVar( name: string ): string | undefined {

        return this.envVars.find( env => env.names.indexOf( name ) !== -1 )?.description;
    }

    /**
     * Checks whether the command has examples or not.
     */
    public hasExamples(): boolean {

        return this.examples.length > 0;
    }

    /**
     * Get examples.
     */
    public getExamples(): IExample[] {

        return this.examples;
    }

    /**
     * Checks whether the command has an example with given name or not.
     *
     * @param name Name of the example.
     */
    public hasExample( name: string ): boolean {

        return !!this.getExample( name );
    }

    /**
     * Get example with given name.
     *
     * @param name Name of the example.
     */
    public getExample( name: string ): IExample | undefined {

        return this.examples.find( example => example.name === name );
    }

    /********************************************************************************
     **** HELPER ********************************************************************
     ********************************************************************************/

    /**
     * Write line to stdout without line break.
     *
     * @param args Data to write to stdout.
     */
    public write( ...args: any[] ) {

        stdout.writeSync( new TextEncoder().encode( fill( 2 ) + format( ...args ) ) );
    }

    /**
     * Write line to stderr without line break.
     *
     * @param args Data to write to stdout.
     */
    public writeError( ...args: any[] ) {

        stderr.writeSync( new TextEncoder().encode( fill( 2 ) + red( format( `[${ this.name }]`, ...args ) ) ) );
    }

    /**
     * Write line to stdout.
     *
     * @param args Data to write to stdout.
     */
    public log( ...args: any[] ) {

        this.write( ...args, '\n' );
    }

    /**
     * Write line to stderr.
     *
     * @param args Data to write to stderr.
     */
    public logError( ...args: any[] ) {

        this.writeError( ...args, '\n' );
    }

    /**
     * Handle error. If throwOnError is enabled all error's will be thrown, if not `Deno.exit(1)` will be called.
     *
     * @param error Error to handle.
     */
    public error( error: Error ): string | Error {

        if ( this.throwOnError ) {
            return error;
        }

        const { DENO_COMMAND_DEBUG } = Deno.env();

        this.help();
        this.logError( DENO_COMMAND_DEBUG ? error : error.message );
        this.log();

        Deno.exit( 1 );
    }
}
