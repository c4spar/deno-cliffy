import { encodeBase64 } from './deps.ts';

export const ESC = '\x1B';
export const CSI = `${ ESC }[`;
export const OSC = `${ ESC }]`;
export const BEL = '\u0007';
const SEP = ';';

export const cursor = {
    /** Move cursor to x, y, counting from the top left corner. */
    to( x: number, y?: number ): string {
        if ( typeof y !== 'number' ) {
            return `${ CSI }${ x }G`;
        }
        return `${ CSI }${ y };${ x }H`;
    },
    /** Move cursor by offset. */
    move( x: number, y: number ): string {
        let ret = '';

        if ( x < 0 ) {
            ret += `${ CSI }${ -x }D`;
        } else if ( x > 0 ) {
            ret += `${ CSI }${ x }C`;
        }

        if ( y < 0 ) {
            ret += `${ CSI }${ -y }A`;
        } else if ( y > 0 ) {
            ret += `${ CSI }${ y }B`;
        }

        return ret;
    },
    /** Move cursor up by n lines. */
    up: ( count: number = 1 ): string => `${ CSI }${ count }A`,
    /** Move cursor down by n lines. */
    down: ( count: number = 1 ): string => `${ CSI }${ count }B`,
    /** Move cursor right by n lines. */
    forward: ( count: number = 1 ): string => `${ CSI }${ count }C`,
    /** Move cursor left by n lines. */
    backward: ( count: number = 1 ): string => `${ CSI }${ count }D`,
    /** Move cursor to the beginning of the line n lines down. */
    nextLine: ( count: number = 1 ): string => `${ CSI }E`.repeat( count ),
    /** Move cursor to the beginning of the line n lines up. */
    prevLine: ( count: number = 1 ): string => `${ CSI }F`.repeat( count ),
    /** Move cursor to first column of current row. */
    left: `${ CSI }G`,
    /** Hide cursor. */
    hide: `${ CSI }?25l`,
    /** Show cursor. */
    show: `${ CSI }?25h`,
    /** Save cursor. */
    save: `${ ESC }7`,
    /** Restore cursor. */
    restore: `${ ESC }8`
};

export const scroll = {
    /** Scroll window up by n lines. */
    up: ( count: number = 1 ): string => `${ CSI }S`.repeat( count ),
    /** Scroll window down by n lines. */
    down: ( count: number = 1 ): string => `${ CSI }T`.repeat( count )
};

export const erase = {
    /** Clear screen. */
    screen: `${ CSI }2J`,
    /** Clear screen up. */
    up: ( count: number = 1 ): string => `${ CSI }1J`.repeat( count ),
    /** Clear screen down. */
    down: ( count: number = 1 ): string => `${ CSI }0J`.repeat( count ),
    /** Clear current line. */
    line: `${ CSI }2K`,
    /** Clear to line end. */
    lineEnd: `${ CSI }0K`,
    /** Clear to line start. */
    lineStart: `${ CSI }1K`,
    /** Clear n line's up. */
    lines( count: number ): string {
        let clear = '';
        for ( let i = 0; i < count; i++ ) {
            clear += this.line + ( i < count - 1 ? cursor.up() : '' );
        }
        clear += cursor.left;
        return clear;
    }
};

/** Render link. */
export const link = ( text: string, url: string ): string => [
    OSC,
    '8',
    SEP,
    SEP,
    url,
    BEL,
    text,
    OSC,
    '8',
    SEP,
    SEP,
    BEL
].join( '' );

export interface ImageOptions {
    width?: number;
    height?: number;
    preserveAspectRatio?: boolean;
}

/** Render image. */
export const image = ( buffer: Uint8Array, options?: ImageOptions ): string => {
    let ret = `${ OSC }1337;File=inline=1`;

    if ( options?.width ) {
        ret += `;width=${ options.width }`;
    }

    if ( options?.height ) {
        ret += `;height=${ options.height }`;
    }

    if ( options?.preserveAspectRatio === false ) {
        ret += ';preserveAspectRatio=0';
    }

    return ret + ':' + encodeBase64( buffer ) + BEL;
};
