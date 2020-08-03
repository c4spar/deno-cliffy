import { blue } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { Figures } from '../lib/figures.ts';
import { GenericInput, GenericInputKeys, GenericInputPromptOptions, GenericInputPromptSettings } from '../lib/generic-input.ts';

export interface InputKeys extends GenericInputKeys {}

export interface InputOptions extends GenericInputPromptOptions<string> {
    minLength?: number;
    maxLength?: number;
    keys?: InputKeys;
}

interface InputSettings extends GenericInputPromptSettings<string> {
    minLength: number;
    maxLength: number;
    keys?: InputKeys;
}

export class Input extends GenericInput<string, InputSettings> {

    public static async prompt( options: string | InputOptions ): Promise<string> {

        if ( typeof options === 'string' ) {
            options = { message: options };
        }

        return new this( {
            pointer: blue( Figures.POINTER_SMALL ),
            minLength: 0,
            maxLength: Infinity,
            ...options
        } ).prompt();
    }

    protected validate( value: string ): boolean | string {
        if ( typeof value !== 'string' ) {
            return false;
        }
        if ( value.length < this.settings.minLength ) {
            return `Value must be longer then ${ this.settings.minLength } but has a length of ${ value.length }.`;
        }
        if ( value.length > this.settings.maxLength ) {
            return `Value can't be longer then ${ this.settings.maxLength } but has a length of ${ value.length }.`;
        }
        return true;
    }

    protected transform( value: string ): string | undefined {
        return value.trim();
    }

    protected format( value: string ): string {
        return value;
    }
}
