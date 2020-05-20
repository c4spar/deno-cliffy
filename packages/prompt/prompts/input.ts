import { blue } from 'https://deno.land/std@v0.52.0/fmt/colors.ts';
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

    protected validate( value: string ): boolean {
        return typeof value === 'string' && value.length > 0;
    }

    protected transform( value: string ): string | undefined {
        return value.trim();
    }

    protected format( value: string ): string {
        return value;
    }
}
