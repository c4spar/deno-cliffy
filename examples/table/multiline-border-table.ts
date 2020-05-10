#!/usr/bin/env -S deno run

import { Table } from '../../packages/table/lib/table.ts';

Table.from( [
         [ 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.', 'cell2', 'cell3' ],
         [ 'cell1', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', 'cell3' ],
         [ 'cell1', 'cell2', 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.' ]
     ] )
     .maxCellWidth( 20 )
     .border( true )
     .render();
