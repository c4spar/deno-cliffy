const { stdout, stderr } = Deno;
import { encode } from 'https://deno.land/std@v0.52.0/encoding/utf8.ts';
import { dim, red } from 'https://deno.land/std@v0.52.0/fmt/colors.ts';
import { parseFlags } from '../../flags/lib/flags.ts';
import { IFlagArgument, IFlagOptions, IFlags, IFlagsResult, IFlagValue, IFlagValueHandler, IFlagValueType, IGenericObject, ITypeHandler, OptionType } from '../../flags/lib/types.ts';
import { fill } from '../../flags/lib/utils.ts';
import format from '../../x/format.ts';
import { BooleanType } from '../types/boolean.ts';
import { NumberType } from '../types/number.ts';
import { StringType } from '../types/string.ts';
import { Type } from '../types/type.ts';
import { CommandMap, IAction, IArgumentDetails, ICommandOption, ICompleteHandler, ICompleteHandlerMap, IEnvVariable, IExample, IHelpCommand, IOption, IParseResult, isHelpCommand } from './types.ts';

const permissions: any = ( Deno as any ).permissions;
const envPermissionStatus: any = permissions && permissions.query && await permissions.query( { name: 'env' } );
const hasEnvPermissions: boolean = !!envPermissionStatus && envPermissionStatus.state === 'granted';

/**
 * Map of type's.
 */
export type ITypeMap = IGenericObject<Type<any> | ITypeHandler<any>>

/**
 * Base command implementation without pre configured command's and option's.
 */
export class BaseCommand<O = any, A extends Array<any> = any> {

    protected types: ITypeMap = {
        string: new StringType(),
        number: new NumberType(),
        boolean: new BooleanType()
    };
    protected rawArgs: string[] = [];
    // @TODO: get script name: https://github.com/denoland/deno/pull/5034
    // protected name: string = location.pathname.split( '/' ).pop() as string;
    protected _name: string = 'COMMAND';
    protected _parent?: BaseCommand;
    protected ver: string = '0.0.0';
    protected desc: string = 'No description ...';
    protected fn: IAction<O, A> | undefined;
    protected options: IOption<O, A>[] = [];
    protected commands: Map<string, CommandMap> = new Map();
    protected examples: IExample[] = [];
    protected envVars: IEnvVariable[] = [];
    protected completions: ICompleteHandlerMap = {};
    protected cmd: BaseCommand = this;
    protected argsDefinition: string | undefined;
    protected isExecutable: boolean = false;
    protected throwOnError: boolean = false;
    protected cmdName: string | undefined;
    protected _allowEmpty: boolean = true;
    protected defaultCommand: string | undefined;
    protected _useRawArgs: boolean = false;
    protected args: IArgumentDetails[] = [];
    protected isHidden: boolean = false;

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

        if ( this.hasCommand( name ) ) {
            if ( !override ) {
                throw this.error( new Error( `Duplicate command: ${ name }` ) );
            }
            this.removeCommand( name );
        }

        const subCommand = ( cmd || new BaseCommand() ).reset();

        subCommand._name = name;
        subCommand._parent = this;

        if ( executableDescription ) {
            subCommand.isExecutable = true;
            subCommand.description( executableDescription );
        }

        if ( result.typeDefinition ) {
            subCommand.arguments( result.typeDefinition );
        }

        // if ( name === '*' && !subCommand.isExecutable ) {
        //     subCommand.isExecutable = true;
        // }

        this.commands.set( name, { name, cmd: subCommand, aliases } );

        this.select( name );

        return this;
    }

    // public static async exists( name: string ) {
    //
    //     const proc = Deno.run( {
    //         cmd: [ 'sh', '-c', 'compgen -c' ],
    //         stdout: 'piped',
    //         stderr: 'piped'
    //     } );
    //     const output: Uint8Array = await proc.output();
    //     const commands = new TextDecoder().decode( output )
    //                                       .trim()
    //                                       .split( '\n' );
    //
    //     return commands.indexOf( name ) !== -1;
    // }

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

        this.getCommandMap( this.cmdName ).aliases.push( alias );

        return this;
    }

    /**
     * Reset internal command reference to main command.
     */
    public reset(): this {
        this.cmd = this;
        this.getCommands( true ).forEach( cmd => cmd.reset() );
        return this;
    }

    /**
     * Reset internal command reference to child command with given name.
     *
     * @param name Sub-command name.
     */
    public select( name: string ): this {

        this.cmd = this.getCommand( name );
        this.cmdName = name;

        return this;
    }

    /********************************************************************************
     **** SUB HANDLER ***************************************************************
     ********************************************************************************/

    /**
     * Get or set command name.
     */
    public name( name: string ): this {
        this.cmd._name = name;
        return this;
    }

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
     * Set command description.
     *
     * @param description Short command description.
     */
    public hidden(): this {
        this.cmd.isHidden = true;
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
    public action( fn: IAction<O, A> ): this {
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
     * Register command specific custom type.
     */
    public type( type: string, typeHandler: Type<any> | ITypeHandler<any>, override?: boolean ): this {

        if ( this.cmd.types[ type ] && !override ) {
            throw this.error( new Error( `Type '${ type }' already exists.` ) );
        }

        this.cmd.types[ type ] = typeHandler;

        return this;
    }

    /**
     * Register command specific custom type.
     */
    public complete( action: string, completeHandler: ICompleteHandler ): this {

        if ( this.cmd.completions[ action ] ) {
            throw this.error( new Error( `Completion '${ action }' already exists.` ) );
        }

        this.cmd.completions[ action ] = completeHandler;

        return this;
    }

    public getActionNames(): string[] {

        return [ ...Object.keys( this.cmd.completions ), ...Object.keys( this.cmd.types ) ];
    }

    /**
     * Throw error's instead of calling `Deno.exit()` to handle error's manually.
     * This has no effect for parent commands. Only for the command on which this method was called and all child commands.
     */
    public throwErrors(): this {
        this.cmd.throwOnError = true;
        return this;
    }

    protected shouldThrowErrors(): boolean {
        return this.cmd.throwOnError || !!this.cmd._parent?.shouldThrowErrors();
    }

    public async getCompletion( action: string ): Promise<string[] | undefined> {

        if ( this.cmd.completions[ action ] ) {
            return this.cmd.completions[ action ]();
        }

        const type = this.cmd.types[ action ];

        if ( type instanceof Type ) {
            return type.complete();
        }

        return undefined;
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
    public option( flags: string, desc: string, opts?: ICommandOption<O, A> ): this;
    public option( flags: string, desc: string, opts?: ICommandOption<O, A> | IFlagValueHandler ): this {

        if ( typeof opts === 'function' ) {
            return this.option( flags, desc, { value: opts } );
        }

        const result = this.splitArguments( flags );

        if ( !result.typeDefinition ) {
            result.typeDefinition = '[value:boolean]';
        }

        const args: IArgumentDetails[] = result.typeDefinition ? this.parseArgsDefinition( result.typeDefinition ) : [];

        const option: IOption<O, A> = {
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
    public async parse( args: string[], dry?: boolean ): Promise<IParseResult<O, A>> {

        // if ( !this.name ) {
        //     throw new Error( 'Missing command name' );
        // }

        this.reset();

        this.rawArgs = args;

        const subCommand = this.rawArgs.length && this.hasCommand( this.rawArgs[ 0 ] ) && this.getCommand( this.rawArgs[ 0 ] );

        if ( subCommand ) {
            return await subCommand.parse( this.rawArgs.slice( 1 ), dry );
        }

        if ( this.isExecutable ) {

            if ( !dry ) {
                await this.executeExecutable( this.rawArgs );
            }

            return { options: {} as O, args: this.rawArgs as any as A, cmd: this };

        } else if ( this._useRawArgs ) {

            if ( dry ) {
                return { options: {} as O, args: this.rawArgs as any as A, cmd: this };
            }

            return await this.execute( {} as O, ...this.rawArgs as A );

        } else {

            const { flags, unknown } = this.parseFlags( this.rawArgs, true );

            const params = this.parseArguments( unknown, flags );

            this.validateEnvVars();

            if ( dry ) {
                return { options: flags, args: params as any as A, cmd: this };
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
    protected async execute( options: O, ...args: A ): Promise<IParseResult<O, A>> {

        const actionOption = this.findActionFlag( options );

        if ( actionOption && actionOption.action ) {
            await actionOption.action( options, ...args );
            return { options, args: args as any as A, cmd: this };
        }

        if ( this.fn ) {

            try {
                await this.fn( options, ...args );
            } catch ( e ) {
                throw this.error( e );
            }

        } else if ( this.defaultCommand ) {

            if ( !this.hasCommand( this.defaultCommand ) ) {
                throw this.error( new Error( `Default command '${ this.defaultCommand }' not found.` ) );
            }

            try {
                await this.getCommand( this.defaultCommand ).execute( options, ...args );
            } catch ( e ) {
                throw this.error( e );
            }
        }

        return { options, args: args as any as A, cmd: this };
    }

    /**
     * Execute external sub-command.
     *
     * @param args Raw command line arguments.
     */
    protected async executeExecutable( args: string[] ) {

        const [ main, ...names ] = this.getPath().split( ' ' );

        names.unshift( main.replace( /\.ts$/, '' ) );

        const executable = names.join( '-' );

        try {
            // @TODO: create getEnv() method which should return all known environment variables and pass it to Deno.run({env})
            await Deno.run( {
                cmd: [ executable, ...args ]
            } );
            return;
        } catch ( e ) {
            if ( !e.message.match( /No such file or directory/ ) ) {
                throw e;
            }
        }

        try {
            await Deno.run( {
                cmd: [ executable + '.ts', ...args ]
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
    protected parseFlags( args: string[], stopEarly?: boolean, knownFlaks?: IFlags ): IFlagsResult<O> {

        try {
            return parseFlags<O>( args, {
                stopEarly,
                knownFlaks,
                allowEmpty: this._allowEmpty,
                flags: this.options,
                parse: ( type: string, option: IFlagOptions, arg: IFlagArgument, nextValue: string ) => {
                    const parser = this.types[ type ];
                    return parser instanceof Type ? parser.parse( option, arg, nextValue ) : parser( option, arg, nextValue );
                }
            } );
        } catch ( e ) {
            throw this.error( e );
        }
    }

    /**
     * Validate environment variables.
     */
    protected validateEnvVars() {

        if ( !this.envVars.length ) {
            return;
        }

        if ( hasEnvPermissions ) {
            this.envVars.forEach( ( env: IEnvVariable ) => {
                const name = env.names.find( name => !!Deno.env.get( name ) );
                if ( name ) {
                    const value: string | undefined = Deno.env.get( name );
                    try {
                        // @TODO: optimize handling for environment variable error message: parseFlag & parseEnv ?
                        const parser = this.types[ env.type ];
                        parser instanceof Type ? parser.parse( { name }, env, value || '' ) : parser( { name }, env, value || '' );
                    } catch ( e ) {
                        throw new Error( `Environment variable '${ name }' must be of type ${ env.type } but got: ${ value }` );
                    }
                }
            } );
        }
    }

    /**
     * Split arguments string into args and types: -v, --verbose [arg:boolean]
     *
     * @param args Arguments definition.
     */
    protected splitArguments( args: string ) {

        // const parts = args.trim().split( /[,<\[]/g ).map( ( arg: string ) => arg.trim() );
        // const typeParts: string[] = [];
        //
        // while ( parts[ parts.length - 1 ] && parts[ parts.length - 1 ].match( /[\]>]$/ ) ) {
        //     let arg = parts.pop() as string;
        //     const lastPart = arg.slice( 0, -1 );
        //     arg = lastPart === ']' ? `[${ arg }` : `<${ arg }`;
        //     typeParts.unshift( arg );
        // }
        //
        // const typeDefinition: string | undefined = typeParts.join( ' ' ) || undefined;
        //
        // return { args: parts, typeDefinition };

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
     */
    protected parseArguments( args: string[], flags: O ): A {

        const params: IFlagValue[] = [];

        // remove array reference
        args = args.slice( 0 );

        if ( !this.hasArguments() ) {

            if ( args.length ) {
                if ( this.hasCommands( true ) ) {
                    throw this.error( new Error( `Unknown command: ${ args.join( ' ' ) }` ) );
                } else {
                    throw this.error( new Error( `No arguments allowed for command: ${ this._name }` ) );
                }
            }

        } else {

            if ( !args.length ) {

                const required = this.getArguments()
                                     .filter( expectedArg => !expectedArg.optionalValue )
                                     .map( expectedArg => expectedArg.name );

                if ( required.length ) {
                    const flagNames: string[] = Object.keys( flags );
                    const isStandaloneOption: boolean | undefined = flagNames.length === 1 && this.getOption( flagNames[ 0 ] )?.standalone;
                    if ( required.length && !isStandaloneOption ) {
                        throw this.error( new Error( 'Missing argument(s): ' + required.join( ', ' ) ) );
                    }
                }

                return params as A;
            }

            for ( const expectedArg of this.getArguments() ) {

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

        return params as A;
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
                action: parts[ 3 ] || type,
                variadic: false,
                list: type ? arg.indexOf( type + '[]' ) !== -1 : false,
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
     */
    protected findActionFlag( flags: O ): IOption<O, A> | undefined {

        const flagNames = Object.keys( flags );

        for ( const flag of flagNames ) {

            const option = this.getOption( flag );

            if ( option?.action ) {
                return option;
            }
        }

        return;
    }

    /********************************************************************************
     **** GETTER ********************************************************************
     ********************************************************************************/

    /**
     * Get or set command name.
     */
    public getName(): string {
        return this._name;
    }

    /**
     * Get full command path of all parent command names's and current command name.
     */
    public getPath(): string {

        return this._parent ? this._parent.getPath() + ' ' + this._name : this._name;
    }

    /**
     * Get arguments definition.
     */
    public getArgsDefinition(): string | undefined {

        return this.argsDefinition;
    }

    /**
     * Get argument.
     */
    public getArgument( name: string ): IArgumentDetails | undefined {

        return this.getArguments().find( arg => arg.name === name );
    }

    /**
     * Get arguments.
     */
    public getArguments(): IArgumentDetails[] {

        if ( !this.args.length && this.argsDefinition ) {
            this.args = this.parseArgsDefinition( this.argsDefinition );
        }

        return this.args;
    }

    /**
     * Check if command has arguments.
     */
    public hasArguments() {
        return !!this.argsDefinition;
    }

    /**
     * Get command version.
     */
    public getVersion(): string {
        return this.ver || ( this._parent?.getVersion() ?? '' );
    }

    /**
     * Get command description.
     */
    public getDescription(): string {

        return this.desc;
    }

    public getShortDescription(): string {

        return this.getDescription()
                   .trim()
                   .split( '\n' )
                   .shift() as string;
    }

    /**
     * Checks whether the command has options or not.
     */
    public hasOptions( includeHidden?: boolean ): boolean {

        if ( includeHidden ) {
            return this.options.length > 0;
        }

        return this.options.filter( opt => !opt.hidden ).length > 0;
    }

    public getOptions( includeHidden?: boolean ): IOption<O>[] {

        if ( includeHidden ) {
            return this.options;
        }

        return this.options.filter( opt => !opt.hidden );
    }

    /**
     * Checks whether the command has an option with given name or not.
     */
    public hasOption( name: string ): boolean {

        return !!this.getOption( name );
    }

    /**
     * Get option by name.
     *
     * @param name Name of the option. Must be in param-case.
     */
    public getOption( name: string ): IOption<O> | undefined {

        return this.options.find( option => option.name === name );
    }

    /**
     * Remove option by name.
     *
     * @param name Name of the option. Must be in param-case.
     */
    public removeOption( name: string ): IOption<O> | undefined {

        const index = this.options.findIndex( option => option.name === name );

        if ( index === -1 ) {
            return;
        }

        return this.options.splice( index, 1 )[ 0 ];
    }

    /**
     * Checks whether the command has sub-commands or not.
     */
    public hasCommands( includeHidden?: boolean ): boolean {

        if ( includeHidden ) {
            return this.commands.size > 0;
        }

        return this.getCommandMaps( includeHidden ).length > 0;
    }

    /**
     * Get sub-command maps.
     */
    public getCommandMaps( includeHidden?: boolean ): CommandMap[] {

        const cmds: CommandMap[] = Array.from( this.commands.values() );

        if ( includeHidden ) {
            return cmds;
        }

        return cmds.filter( ( { cmd }: CommandMap ) => !cmd.isHidden );
    }

    /**
     * Get sub-commands.
     */
    public getCommands( includeHidden?: boolean ): BaseCommand[] {

        return this.getCommandMaps( includeHidden ).map( ( { cmd }: CommandMap ) => cmd );
    }

    /**
     * Checks whether the command has a sub-command with given name or not.
     *
     * @param name Name of the command.
     */
    public hasCommand( name: string ): boolean {

        return this.commands.has( name );
    }

    /**
     * Get sub-command with given name.
     *
     * @param name Name of the sub-command.
     */
    public getCommand<O = any>( name: string ): BaseCommand<O> {

        return this.getCommandMap( name ).cmd;
    }

    /**
     * Get sub-command map with given name.
     *
     * @param name Name of the sub-command.
     */
    public getCommandMap<O = any>( name: string ): CommandMap<O> {

        const cmd: CommandMap<O> | undefined = this.commands.get( name );
        // || this.commands.get( '*' );

        if ( !cmd ) {
            throw this.error( new Error( `Sub-command not found: ${ name }` ) );
        }

        return cmd;
    }

    /**
     * Remove sub-command with given name.
     *
     * @param name Name of the command.
     */
    public removeCommand<O = any>( name: string ): BaseCommand<O> {

        const command = this.getCommand( name );
        this.commands.delete( name );

        return command;
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

        stdout.writeSync( encode( fill( 2 ) + format( ...args ) ) );
    }

    /**
     * Write line to stderr without line break.
     *
     * @param args Data to write to stdout.
     */
    public writeError( ...args: any[] ) {

        stderr.writeSync( encode( fill( 2 ) + red( format( `[ERROR:${ this._name }]`, ...args ) ) ) );
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
     * Handle error. If `.throwErrors()` was called all error's will be thrown, otherwise `Deno.exit(1)` will be called.
     *
     * @param error Error to handle.
     * @param showHelp Show help.
     */
    public error( error: Error, showHelp: boolean = true ): Error {

        if ( this.shouldThrowErrors() ) {
            return error;
        }

        const CLIFFY_DEBUG: boolean = hasEnvPermissions ? !!Deno.env.get( 'CLIFFY_DEBUG' ) : false;

        showHelp && this.help();
        this.logError( CLIFFY_DEBUG ? error : error.message );
        this.log();

        Deno.exit( 1 );
    }

    /**
     * Execute help command.
     */
    public help() {

        this.getHelpCommand().show();
    }

    public getHelpCommand(): IHelpCommand {

        if ( !this.hasCommand( 'help' ) ) {
            throw this.error( new Error( `No help command registered.` ), false );
        }

        const helpCommand = this.getCommand( 'help' );

        if ( !isHelpCommand( helpCommand ) ) {
            throw this.error( new Error( `The registered help command does not correctly implement interface IHelpCommand.` ), false );
        }

        return helpCommand;
    }
}
