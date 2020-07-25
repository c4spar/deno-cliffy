#!/usr/bin/env -S deno run

import { Table } from '../../packages/table/lib/table.ts';

new Table()
    .header( [ 'Heading 1', 'Heading 2', 'Heading 3' ] )
    .body( [
        [ 'Row 1 Column 1', 'Row 1 Column 2', 'Row 1 Column 3' ],
        [ 'Row 2 Column 1', 'Row 2 Column 2', 'Row 2 Column 3' ],
        [ 'Row 3 Column 1', 'Row 3 Column 2', 'Row 3 Column 3' ]
    ] )
    .render();
