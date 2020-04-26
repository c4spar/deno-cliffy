import { blue } from 'https://deno.land/std@v0.41.0/fmt/colors.ts';
import { Figures } from '../lib/figures.ts';
import { GenericInput, GenericInputPromptOptions, GenericInputPromptSettings } from './generic-input.ts';

export interface InputPromptOptions extends GenericInputPromptOptions<string> {

}

export interface InputPromptSettings extends GenericInputPromptSettings<string> {

}

export class Input extends GenericInput<string, InputPromptSettings> {

    public static async prompt( options: InputPromptOptions ): Promise<string | undefined> {

        return new this( {
            pointer: blue( Figures.POINTER_SMALL ),
            ...options
        } ).run();
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
