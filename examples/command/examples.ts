#!/usr/bin/env -S deno run

import { red } from 'https://deno.land/std@0.63.0/fmt/colors.ts';
import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .name( 'examples' )
    .example( 'example name', `Description ...\n\nCan have mutliple lines and ${ red( 'colors' ) }.` )
    .parse( Deno.args );
