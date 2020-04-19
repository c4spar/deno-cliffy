import { GenericInput, GenericInputPromptOptions } from './generic-input.ts';

export interface InputPromptOptions extends GenericInputPromptOptions<string> {

}

export interface InputPromptSettings extends InputPromptOptions {

}

export class Input extends GenericInput<string, InputPromptOptions, InputPromptSettings> {

    public static async prompt( options: InputPromptOptions ): Promise<string | undefined> {

        return new this( options ).run();
    }

    protected sanitize( value: string ): string | undefined {
        return value;
    }

    protected validate( value: string | undefined ): boolean {
        return !!( value && value.length );
    }

    protected transform( value: string ): string {
        return value;
    }
}
