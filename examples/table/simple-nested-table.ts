#!/usr/bin/env -S deno --allow-env

import { Table } from '../../packages/table/lib/table.ts';

Table.from( [ [
         Table.from( [
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ]
              ] )
              .padding( 1 )
              .toString(),
         Table.from( [
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ]
              ] )
              .padding( 1 )
              .toString(),
         Table.from( [
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ]
              ] )
              .padding( 1 )
              .toString()
     ], [
         Table.from( [
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ]
              ] )
              .padding( 1 )
              .toString(),
         Table.from( [
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ]
              ] )
              .padding( 1 )
              .toString(),
         Table.from( [
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ]
              ] )
              .padding( 1 )
              .toString()
     ], [
         Table.from( [
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ]
              ] )
              .padding( 1 )
              .toString(),
         Table.from( [
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ]
              ] )
              .padding( 1 )
              .toString(),
         Table.from( [
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ],
                  [ 'cell1', 'cell2', 'cell3' ]
              ] )
              .padding( 1 )
              .toString()
     ] ] )
     .padding( 1 )
     .render();
