#!/usr/bin/env -S deno run

import { Table } from '../../packages/table/lib/table.ts';

Table.from( [
         [ 'cell1', 'cell2', 'cell3' ],
         [ 'cell1', 'cell2', 'cell3' ],
         [ 'cell1', 'cell2', 'cell3' ]
     ] )
     .border( true )
     .render();
