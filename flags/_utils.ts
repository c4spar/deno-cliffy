export function paramCaseToCamelCase( str: string ): string {
    return str.replace( /-([a-z])/g, g => g[ 1 ].toUpperCase() );
}
