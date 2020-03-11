import snakeCase from '../../../x/snakeCase.ts';
import { BaseCommand } from '../../lib/base-command.ts';
import { DefaultCommand } from '../../lib/default-command.ts';
import { IOption } from '../../lib/types.ts';

/**
 * Generates zsh completion code.
 */
export class ZshCompletionsCommand extends DefaultCommand {

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

        let completions = `##\n# Start ${ this.parent.getPath() } zsh completions \n#\n\n`;

        completions += `autoload -U is-at-least\n\n${ this.generateCompletions( this.parent ) }`;

        completions += `compdef _${ snakeCase( this.parent.getPath() ) } ${ this.parent.getPath() }`;

        completions += `\n\n#\n# End ${ this.parent.getPath() } zsh completions \n##`;

        return completions;
    }

    /**
     * Generates zsh completions method for given command and child commands.
     */
    private generateCompletions( command: BaseCommand ): string {

        const fnName = snakeCase( command.getPath() );
        const commands = command.getCommands();

        const commandDefinitions: string[] = commands
            .map( ( subCommand: BaseCommand ) => `'${ subCommand.getName() }:${ subCommand.getDescription() }'` );

        const options: string[] = command
            .getOptions()
            .map( ( option: IOption ) =>
                option.flags
                      .split( /[, ] */g )
                      .map( ( flag: string ) => `'${ flag }[${ option.description }]'` ) )
            .flat();

        const subCommandCompletions = commands
            .map( ( subCommand: BaseCommand ) => this.generateCompletions( subCommand ) )
            .join( '' );

        let completions = `function _${ fnName }() {

    # completion area for subcommands
    function _commands() { `;

        if ( commandDefinitions.length ) {
            completions += `
        local -a commands
        commands=(
            ${ commandDefinitions.join( '\n            ' ) }
        )
        _describe 'command' commands
    `;
        }

        completions += `}

    # completion area for options/arguments
    _arguments \\
        ${ options.length ? options.join( ' \\\n        ' ) + '\\\n        ' : '' }'1: :_commands' \\
        '*::arg:->args'
`;

        if ( commands.length ) {
            completions += `
    case \$line[1] in
        ${ commands.map( ( command: BaseCommand ) => `${ command.getName() }) _${ snakeCase( command.getPath() ) } ;;` )
                   .join( '\n        ' ) }
    esac
`;
        }

        completions += `}`;

        return `${ completions }\n\n${ subCommandCompletions }`;
    }
}
