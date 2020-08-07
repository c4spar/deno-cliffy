export function camelCaseToParamCase( str: string ): string {
    return str.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

export function paramCaseToCamelCase( str: string ): string {
    return str.replace( /-([a-z])/g, g => g[ 1 ].toUpperCase() );
}
