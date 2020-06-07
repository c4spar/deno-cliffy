#!/usr/bin/env -S deno run

import { parseFlags } from '../../packages/flags/lib/flags.ts';

console.log( parseFlags( Deno.args ) );
