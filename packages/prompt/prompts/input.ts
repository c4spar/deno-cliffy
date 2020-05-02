import { blue } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { Figures } from '../lib/figures.ts';
import { GenericInput, GenericInputPromptOptions, GenericInputPromptSettings } from '../lib/generic-input.ts';

export interface InputOptions extends GenericInputPromptOptions<string> {

}

export interface InputSettings extends GenericInputPromptSettings<string> {

}

export class Input extends GenericInput<string, InputSettings> {

    public static async prompt( options: string | InputOptions ): Promise<string | undefined> {

        if ( typeof options === 'string' ) {
            options = { message: options };
        }

        return new this( {
            pointer: blue( Figures.POINTER_SMALL ),
            ...options
        } ).prompt();
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
