#!/usr/bin/env -S deno run

import { Cell } from '../../packages/table/lib/cell.ts';
import { Row } from '../../packages/table/lib/row.ts';
import { Table } from '../../packages/table/lib/table.ts';

new Table()
    .header( Row.from( [ 'Heading 1', 'Heading 2', 'Heading 3' ] ).border( true ) )
    .body( [
        [ 'Row 1 Column 1', Cell.from( 'Row 1 Column 2' ).border( true ), 'Row 1 Column 3' ],
        new Row( 'Row 2 Column 1', 'Row 2 Column 2', 'Row 2 Column 3' ).border( true ),
        [ 'Row 3 Column 1', 'Row 3 Column 2', 'Row 3 Column 3' ]
    ] )
    .render();
console.log();
