import snakeCase from '../../../x/snakeCase.ts';
import { BaseCommand } from '../../lib/base-command.ts';
import { DefaultCommand } from '../../lib/default-command.ts';
import { IArgumentDetails, IOption } from '../../lib/types.ts';

export interface IAction {
    arg: IArgumentDetails;
    label: string;
    name: string;
    cmd: string;
}

/**
 * Generates zsh completion code.
 */
export class ZshCompletionsCommand extends DefaultCommand {

    /**
     * Actions from the command which is currently parsing.
     */
    protected actions: Map<string, IAction> = new Map();

    public constructor( protected parent: BaseCommand ) {

        super();

        this.description( 'Generate zsh shell completions.' )
            .action( () => console.log( this.generate() ) );
    }

    /**
     * @inheritDoc
     */
    public command( nameAndArguments: string, cmd?: BaseCommand | string, override?: boolean ): this {

        return super.command( nameAndArguments, cmd || new DefaultCommand(), override );
    }

    /**
     * Generates zsh completions code.
     */
    protected generate(): string {

        return `
# compdef _${ snakeCase( this.parent.getPath() ) } ${ this.parent.getPath() }
#
# zsh completion for ${ this.parent.getPath() }
#
# version: ${ this.parent.getVersion() }
#

autoload -U is-at-least

(( $+functions[__${ snakeCase( this.parent.getName() ) }_script] )) ||
function __${ snakeCase( this.parent.getName() ) }_script {
    local name="$1"; shift
    local action="$1"; shift
    integer ret=1
    local -a values
    local expl
    _tags "$name"
    while _tags; do
        if _requested "$name"; then
            values=( \$( ${ this.parent.getName() } completions complete $action $@) )
            if (( \${#values[@]} )); then
                while _next_label "$name" expl "$action"; do
                    compadd -S '' "\$expl[@]" $values[@]
                done
            fi
        fi
    done
}

${ this.generateCompletions( this.parent, true ).trim() }

# _${ snakeCase( this.parent.getPath() ) } "\${@}"

compdef _${ snakeCase( this.parent.getPath() ) } ${ this.parent.getPath() }

#
# Local Variables:
# mode: Shell-Script
# sh-indentation: 4
# indent-tabs-mode: nil
# sh-basic-offset: 4
# End:
# vim: ft=zsh sw=4 ts=4 et
`.trim();
    }

    /**
     * Generates zsh completions method for given command and child commands.
     */
    private generateCompletions( command: BaseCommand, root?: boolean ): string {

        if ( !command.hasCommands() && !command.hasOptions() && !command.hasArguments() ) {
            return '';
        }

        return `(( $+functions[_${ snakeCase( command.getPath() ) }] )) ||
function _${ snakeCase( command.getPath() ) }() {`
            + ( root ? `\n\n    local context state state_descr line\n    typeset -A opt_args` : '' )
            + this.generateCommandCompletions( command )
            + this.generateSubCommandCompletions( command )
            + this.generateArgumentCompletions( command )
            + this.generateActions( command )
            + `\n}\n\n`
            + command.getCommands()
                     .map( subCommand => this.generateCompletions( subCommand ) )
                     .join( '' );
    }

    protected generateCommandCompletions( command: BaseCommand ): string {

        const commands = command.getCommands();

        let completions: string = commands
            .map( ( subCommand: BaseCommand ) =>
                `'${ subCommand.getName() }:${ subCommand.getShortDescription() }'` )
            .join( '\n            ' );

        if ( completions ) {
            completions = `
        local -a commands
        commands=(
            ${ completions }
        )
        _describe 'command' commands`;
        }

        if ( command.hasArguments() ) {

            const completionsPath: string = command.getPath().split( ' ' ).slice( 1 ).join( ' ' );

            const arg: IArgumentDetails = command.getArguments()[ 0 ];

            const action = this.addAction( arg, completionsPath );

            if ( action ) {
                completions += `\n        __${ snakeCase( this.parent.getName() ) }_script ${ action.arg.name } ${ action.arg.action } ${ action.cmd }`;
            }
        }

        if ( completions ) {
            completions = `\n\n    function _commands() {${ completions }\n    }`;
        }

        return completions;
    }

    protected generateSubCommandCompletions( command: BaseCommand ): string {

        if ( command.hasCommands() ) {

            const actions: string = command
                .getCommands()
                .map( ( command: BaseCommand ) => `${ command.getName() }) _${ snakeCase( command.getPath() ) } ;;` )
                .join( '\n            ' );

            return `\n
    function _command_args() {
        case "$words[1]" in\n            ${ actions }\n        esac
    }`;
        }

        return '';
    }

    protected generateArgumentCompletions( command: BaseCommand ): string {

        /* clear actions from previously parsed command. */
        this.actions.clear();

        const options: string[] = this.generateOptions( command );

        let argIndex = 0;
        let argsCommand = '\n\n    _arguments -w -s -S -C';

        if ( command.hasOptions() ) {
            argsCommand += ` \\\n        ${ options.join( ' \\\n        ' ) }`;
        }

        if ( command.hasCommands() || command.hasArguments() ) {
            argsCommand += ` \\\n        '${ ++argIndex }: :_commands'`;
        }

        if ( command.hasArguments() || command.hasCommands() ) {

            const args: string[] = [];

            for ( const arg of command.getArguments().slice( 1 ) ) {

                const completionsPath: string = command.getPath().split( ' ' ).slice( 1 ).join( ' ' );

                const action = this.addAction( arg, completionsPath );

                args.push( `${ ++argIndex }${ arg.optionalValue ? '::' : ':' }${ action.name }` );
            }

            argsCommand += args.map( ( arg: string ) => `\\\n        '${ arg }'` ).join( '' );

            if ( command.hasCommands() ) {
                argsCommand += ` \\\n        '*:: :->command_args'`;
            }
        }

        return argsCommand;
    }

    protected generateOptions( command: BaseCommand ) {

        const options: string[] = [];
        const cmdArgs: string[] = command.getPath().split( ' ' );
        const baseName: string = cmdArgs.shift() as string;
        const completionsPath: string = cmdArgs.join( ' ' );

        const excluded: string[] = command.getOptions( false )
            .map( option => option.standalone ? option.flags.split( /[, ] */g ) : false )
            .flat()
            .filter( flag => typeof flag === 'string' ) as string[];

        for ( const option of command.getOptions( false ) ) {

            const optExcluded = option.conflicts ? [ ...excluded, ...option.conflicts ] : excluded;

            const flags: string[] = option.flags.split( /[, ] */g );

            const flagExcluded = option.collect ? optExcluded : [
                ...optExcluded,
                ...flags
            ];
            options.push( this.generateOption( option, baseName, completionsPath, flagExcluded ) );
        }

        return options;
    }

    protected generateOption( option: IOption, baseName: string, completionsPath: string, excludedFlags: string[] ): string {

        let args: string = '';
        for ( const arg of option.args ) {

            const action = this.addAction( arg, completionsPath );

            if ( arg.variadic ) {
                args += `${ arg.optionalValue ? '::' : ':' }${ arg.name }:->${ action.name }`;
            } else {
                args += `${ arg.optionalValue ? '::' : ':' }${ arg.name }:->${ action.name }`;
            }
        }

        const description: string | undefined = option.description.trim().split( '\n' ).shift();
        const collect: string = option.collect ? '*' : '';
        const flags: string = option.flags.replace( / +/g, '' );

        if ( option.standalone ) {
            return `'(- *)'{${ collect }${ flags }}'[${ description }]${ args }'`;
        } else {
            const excluded: string = excludedFlags.length ? `(${ excludedFlags.join( ' ' ) })` : '';
            return `'${ excluded }'{${ collect }${ flags }}'[${ description }]${ args }'`;
        }
    }

    protected addAction( arg: IArgumentDetails, cmd: string ): IAction {

        const action = `${ arg.name }-${ arg.action }`;

        if ( !this.actions.has( action ) ) {
            this.actions.set( action, {
                arg: arg,
                label: `${ arg.name }: ${ arg.action }`,
                name: action,
                cmd
            } );
        }

        return this.actions.get( action ) as IAction;
    }

    protected generateActions( command: BaseCommand ): string {

        let actions: string[] = [];

        if ( this.actions.size ) {

            actions = Array
                .from( this.actions )
                .map( ( [ name, action ] ) =>
                    `${ name }) __${ snakeCase( this.parent.getName() ) }_script ${ action.arg.name } ${ action.arg.action } ${ action.cmd } ;;` );
        }

        if ( command.hasCommands() ) {
            actions.unshift( `command_args) _command_args ;;` );
        }

        if ( actions.length ) {
            return `\n\n    case "$state" in\n        ${ actions.join( '\n        ' ) }\n    esac`;
        }

        return '';
    }
}
