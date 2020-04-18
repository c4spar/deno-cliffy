import { PromptModuleConstructor } from './prompt-module.ts';

export type QuestionType =
    'list'
    | 'rawlist'
    | 'expand'
    | 'checkbox'
    | 'confirm'
    | 'input'
    | 'number'
    | 'secure'
    | string;

export type ValidateResult = string | boolean | Promise<string | boolean>;

export interface PromptModuleOptions<T> {
    message: string;
    default?: T;
    sanitize?: ( value: string | T ) => T | undefined;
    validate?: ( value: T | undefined ) => ValidateResult;
    transform?: ( value: T | undefined ) => boolean;
}

export interface Question<T> extends PromptModuleOptions<T> {
    name: string;
    type: QuestionType;
}

export type TypesMap = { [key in QuestionType]: PromptModuleConstructor<any, PromptModuleOptions<any>> };

export type PromptHandler = ( ...questions: Question<any>[] ) => void | Promise<void>;
