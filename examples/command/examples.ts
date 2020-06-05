#!/usr/bin/env -S deno run

import { red } from 'https://deno.land/std/fmt/colors.ts';
import { Command } from '../../packages/command/lib/command.ts';

await new Command()
    .example( 'example name', `Description ...\n\nCan have mutliple lines and ${ red( 'colors' ) }.` )
    .parse( Deno.args );
