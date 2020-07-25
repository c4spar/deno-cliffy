#!/usr/bin/env -S deno run

import { Table } from '../../packages/table/lib/table.ts';

const table: Table = Table.from( [
    [ 'Row 2 Column 1', 'Row 2 Column 2', 'Row 2 Column 3' ],
    [ 'Row 1 Column 1', 'Row 1 Column 2', 'Row 1 Column 3' ],
] );

table.push( [ 'Row 3 Column 1', 'Row 3 Column 2', 'Row 3 Column 3' ] );
table.sort();
table.render();
