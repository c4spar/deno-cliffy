import normalCase from './normalCase.ts';

export default function snakeCase( value: string, locale?: string ): string {
    return normalCase( value, locale, '_' );
}
