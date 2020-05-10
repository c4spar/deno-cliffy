#!/usr/bin/env -S deno run

import { Table } from '../../packages/table/lib/table.ts';

Table.render(
    Table.from( [
        [
            Table.from( [
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'Justo duo dolores et ea rebum.', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ]
                 ] )
                 .maxCellWidth( 25 )
                 .border( true )
                 .toString(),
            Table.from( [
                     [ 'cell1', 'cell2', 'Labore et dolore magna aliquyam erat.' ],
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ]
                 ] )
                 .maxCellWidth( 25 )
                 .border( true )
                 .toString(),
            Table.from( [
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ]
                 ] )
                 .maxCellWidth( 25 )
                 .border( true )
                 .toString()
        ],
        [
            Table.from( [
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ]
                 ] )
                 .maxCellWidth( 25 )
                 .border( true )
                 .toString(),
            Table.from( [
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'Sed diam nonumy eirmod tempor invidunt ut labore.', 'cell2', 'cell3' ]
                 ] )
                 .maxCellWidth( 25 )
                 .border( true )
                 .toString(),
            Table.from( [
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ]
                 ] )
                 .maxCellWidth( 25 )
                 .border( true )
                 .toString()
        ],
        [
            Table.from( [
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ]
                 ] )
                 .maxCellWidth( 25 )
                 .border( true )
                 .toString(),
            Table.from( [
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ]
                 ] )
                 .maxCellWidth( 25 )
                 .border( true )
                 .toString(),
            Table.from( [
                     [ 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd.', 'cell2', 'cell3' ],
                     [ 'cell1', 'cell2', 'cell3' ],
                     [ 'cell1', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.', 'cell3' ]
                 ] )
                 .maxCellWidth( 25 )
                 .border( true )
                 .toString()
        ]
    ] )
);
