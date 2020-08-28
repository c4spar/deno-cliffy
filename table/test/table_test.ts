import { Table } from "../table.ts";
import { assertEquals } from "../../dev_deps.ts";

Deno.test("simple table", () => {
  assertEquals(
    Table.from([
      ["cell1", "cell2", "cell3"],
      ["cell1", "cell2", "cell3"],
      ["cell1", "cell2", "cell3"],
    ])
      .padding(1)
      .toString(),
    `
cell1 cell2 cell3
cell1 cell2 cell3
cell1 cell2 cell3`.slice(1),
  );
});

Deno.test("simple table with word break", () => {
  assertEquals(
    Table.from([
      ["cell1", "cell2 cell2", "cell3"],
      ["cell1", "cell2", "cell3"],
      ["cell1", "cell2", "cell3 cell3"],
    ])
      .maxColWidth(4)
      .padding(1)
      .toString(),
    `
cell cell cell
1    2    3   
     cell     
     2        
cell cell cell
1    2    3   
cell cell cell
1    2    3   
          cell
          3   `.slice(1),
  );
});

Deno.test("simple border table", () => {
  assertEquals(
    Table.from([
      ["cell1", "cell2", "cell3"],
      ["cell1", "cell2", "cell3"],
      ["cell1", "cell2", "cell3"],
    ])
      .border(true)
      .toString(),
    `
┌───────┬───────┬───────┐
│ cell1 │ cell2 │ cell3 │
├───────┼───────┼───────┤
│ cell1 │ cell2 │ cell3 │
├───────┼───────┼───────┤
│ cell1 │ cell2 │ cell3 │
└───────┴───────┴───────┘`.slice(1),
  );
});

Deno.test("simple nested table", () => {
  assertEquals(
    Table.from([[
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .toString(),
    ], [
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .toString(),
    ], [
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .toString(),
    ]])
      .padding(1)
      .toString(),
    `
cell1 cell2 cell3 cell1 cell2 cell3 cell1 cell2 cell3
cell1 cell2 cell3 cell1 cell2 cell3 cell1 cell2 cell3
cell1 cell2 cell3 cell1 cell2 cell3 cell1 cell2 cell3
cell1 cell2 cell3 cell1 cell2 cell3 cell1 cell2 cell3
cell1 cell2 cell3 cell1 cell2 cell3 cell1 cell2 cell3
cell1 cell2 cell3 cell1 cell2 cell3 cell1 cell2 cell3
cell1 cell2 cell3 cell1 cell2 cell3 cell1 cell2 cell3
cell1 cell2 cell3 cell1 cell2 cell3 cell1 cell2 cell3
cell1 cell2 cell3 cell1 cell2 cell3 cell1 cell2 cell3`.slice(1),
  );
});

Deno.test("simple nested border table", () => {
  assertEquals(
    Table.from([[
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .border(true)
        .toString(),
    ], [
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .border(true)
        .toString(),
    ], [
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .border(true)
        .toString(),
    ]])
      .padding(1)
      .toString(),
    `
┌─────┬─────┬─────┐ ┌─────┬─────┬─────┐ ┌─────┬─────┬─────┐
│cell1│cell2│cell3│ │cell1│cell2│cell3│ │cell1│cell2│cell3│
├─────┼─────┼─────┤ ├─────┼─────┼─────┤ ├─────┼─────┼─────┤
│cell1│cell2│cell3│ │cell1│cell2│cell3│ │cell1│cell2│cell3│
├─────┼─────┼─────┤ ├─────┼─────┼─────┤ ├─────┼─────┼─────┤
│cell1│cell2│cell3│ │cell1│cell2│cell3│ │cell1│cell2│cell3│
└─────┴─────┴─────┘ └─────┴─────┴─────┘ └─────┴─────┴─────┘
┌─────┬─────┬─────┐ ┌─────┬─────┬─────┐ ┌─────┬─────┬─────┐
│cell1│cell2│cell3│ │cell1│cell2│cell3│ │cell1│cell2│cell3│
├─────┼─────┼─────┤ ├─────┼─────┼─────┤ ├─────┼─────┼─────┤
│cell1│cell2│cell3│ │cell1│cell2│cell3│ │cell1│cell2│cell3│
├─────┼─────┼─────┤ ├─────┼─────┼─────┤ ├─────┼─────┼─────┤
│cell1│cell2│cell3│ │cell1│cell2│cell3│ │cell1│cell2│cell3│
└─────┴─────┴─────┘ └─────┴─────┴─────┘ └─────┴─────┴─────┘
┌─────┬─────┬─────┐ ┌─────┬─────┬─────┐ ┌─────┬─────┬─────┐
│cell1│cell2│cell3│ │cell1│cell2│cell3│ │cell1│cell2│cell3│
├─────┼─────┼─────┤ ├─────┼─────┼─────┤ ├─────┼─────┼─────┤
│cell1│cell2│cell3│ │cell1│cell2│cell3│ │cell1│cell2│cell3│
├─────┼─────┼─────┤ ├─────┼─────┼─────┤ ├─────┼─────┼─────┤
│cell1│cell2│cell3│ │cell1│cell2│cell3│ │cell1│cell2│cell3│
└─────┴─────┴─────┘ └─────┴─────┴─────┘ └─────┴─────┴─────┘`.slice(1),
  );
});

Deno.test("multiline table", () => {
  assertEquals(
    Table.from([
      [
        "Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        "cell2",
        "cell3",
      ],
      [
        "cell1",
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        "cell3",
      ],
      [
        "cell1",
        "cell2",
        "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
      ],
    ])
      .padding(1)
      .maxColWidth(20)
      .toString(),
    `
Stet clita kasd cell2             cell3         
gubergren, no                                   
sea takimata                                    
sanctus est                                     
Lorem ipsum                                     
dolor sit amet.                                 
cell1           Lorem ipsum dolor cell3         
                sit amet,                       
                consetetur                      
                sadipscing elitr,               
                sed diam nonumy                 
                eirmod tempor                   
                invidunt ut                     
                labore et dolore                
                magna aliquyam                  
                erat, sed diam                  
                voluptua.                       
cell1           cell2             At vero eos et
                                  accusam et    
                                  justo duo     
                                  dolores et ea 
                                  rebum. Stet   
                                  clita kasd    
                                  gubergren, no 
                                  sea takimata  
                                  sanctus est   
                                  Lorem ipsum   
                                  dolor sit     
                                  amet.         `.slice(1),
  );
});

Deno.test("multiline border table", () => {
  assertEquals(
    Table.from([
      [
        "Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        "cell2",
        "cell3",
      ],
      [
        "cell1",
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
        "cell3",
      ],
      [
        "cell1",
        "cell2",
        "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
      ],
    ])
      .padding(0)
      .maxColWidth(20)
      .border(true)
      .toString(),
    `
┌───────────────┬─────────────────┬──────────────┐
│Stet clita kasd│cell2            │cell3         │
│gubergren, no  │                 │              │
│sea takimata   │                 │              │
│sanctus est    │                 │              │
│Lorem ipsum    │                 │              │
│dolor sit amet.│                 │              │
├───────────────┼─────────────────┼──────────────┤
│cell1          │Lorem ipsum dolor│cell3         │
│               │sit amet,        │              │
│               │consetetur       │              │
│               │sadipscing elitr,│              │
│               │sed diam nonumy  │              │
│               │eirmod tempor    │              │
│               │invidunt ut      │              │
│               │labore et dolore │              │
│               │magna aliquyam   │              │
│               │erat, sed diam   │              │
│               │voluptua.        │              │
├───────────────┼─────────────────┼──────────────┤
│cell1          │cell2            │At vero eos et│
│               │                 │accusam et    │
│               │                 │justo duo     │
│               │                 │dolores et ea │
│               │                 │rebum. Stet   │
│               │                 │clita kasd    │
│               │                 │gubergren, no │
│               │                 │sea takimata  │
│               │                 │sanctus est   │
│               │                 │Lorem ipsum   │
│               │                 │dolor sit     │
│               │                 │amet.         │
└───────────────┴─────────────────┴──────────────┘`.slice(1),
  );
});

Deno.test("nested multiline border table", () => {
  assertEquals(
    Table.from([[
      Table.from([
        ["sed diam nonumy eirmod tempor invidunt ut labore.", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .maxColWidth(20)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        [
          "cell1",
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr.",
          "cell3",
        ],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .maxColWidth(20)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .maxColWidth(20)
        .toString(),
    ], [
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["takimata sanctus est Lorem ipsum.", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .maxColWidth(20)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["Stet clita kasd gubergren, no sea takimata.", "cell2", "cell3"],
      ])
        .padding(1)
        .maxColWidth(20)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "sanctus est Lorem ipsum dolor sit."],
      ])
        .padding(1)
        .maxColWidth(20)
        .toString(),
    ], [
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["sed diam nonumy eirmod tempor invidunt ut labore.", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .maxColWidth(20)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "accusam et justo duo."],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(1)
        .maxColWidth(20)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["Stet clita kasd gubergren, no sea takimata.", "cell2", "cell3"],
      ])
        .padding(1)
        .maxColWidth(20)
        .toString(),
    ]])
      .padding(1)
      .toString(),
    `
sed diam nonumy cell2 cell3      cell1 cell2             cell3 cell1 cell2 cell3            
eirmod tempor                    cell1 Lorem ipsum dolor cell3 cell1 cell2 cell3            
invidunt ut                            sit amet,               cell1 cell2 cell3            
labore.                                consetetur                                           
cell1           cell2 cell3            sadipscing elitr.                                    
cell1           cell2 cell3      cell1 cell2             cell3                              
cell1                cell2 cell3 cell1           cell2 cell3   cell1 cell2 cell3            
takimata sanctus est cell2 cell3 cell1           cell2 cell3   cell1 cell2 cell3            
Lorem ipsum.                     Stet clita kasd cell2 cell3   cell1 cell2 sanctus est Lorem
cell1                cell2 cell3 gubergren, no                             ipsum dolor sit. 
                                 sea takimata.                                              
cell1           cell2 cell3      cell1 cell2 cell3             cell1           cell2 cell3  
sed diam nonumy cell2 cell3      cell1 cell2 accusam et justo  cell1           cell2 cell3  
eirmod tempor                                duo.              Stet clita kasd cell2 cell3  
invidunt ut                      cell1 cell2 cell3             gubergren, no                
labore.                                                        sea takimata.                
cell1           cell2 cell3                                                                 `
      .slice(1),
  );
});

Deno.test("nested multiline border table", () => {
  assertEquals(
    Table.from([[
      Table.from([
        ["sed diam nonumy eirmod tempor invidunt ut labore.", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .maxColWidth(20)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        [
          "cell1",
          "Lorem ipsum dolor sit amet, consetetur sadipscing elitr.",
          "cell3",
        ],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .maxColWidth(20)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .maxColWidth(20)
        .border(true)
        .toString(),
    ], [
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["takimata sanctus est Lorem ipsum.", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .maxColWidth(20)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["Stet clita kasd gubergren, no sea takimata.", "cell2", "cell3"],
      ])
        .padding(0)
        .maxColWidth(20)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "sanctus est Lorem ipsum dolor sit."],
      ])
        .padding(0)
        .maxColWidth(20)
        .border(true)
        .toString(),
    ], [
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["sed diam nonumy eirmod tempor invidunt ut labore.", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .maxColWidth(20)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "accusam et justo duo."],
        ["cell1", "cell2", "cell3"],
      ])
        .padding(0)
        .maxColWidth(20)
        .border(true)
        .toString(),
      Table.from([
        ["cell1", "cell2", "cell3"],
        ["cell1", "cell2", "cell3"],
        ["Stet clita kasd gubergren, no sea takimata.", "cell2", "cell3"],
      ])
        .padding(0)
        .maxColWidth(20)
        .border(true)
        .toString(),
    ]])
      .padding(1)
      .toString(),
    `
┌───────────────┬─────┬─────┐      ┌─────┬─────────────────┬─────┐ ┌─────┬─────┬─────┐            
│sed diam nonumy│cell2│cell3│      │cell1│cell2            │cell3│ │cell1│cell2│cell3│            
│eirmod tempor  │     │     │      ├─────┼─────────────────┼─────┤ ├─────┼─────┼─────┤            
│invidunt ut    │     │     │      │cell1│Lorem ipsum dolor│cell3│ │cell1│cell2│cell3│            
│labore.        │     │     │      │     │sit amet,        │     │ ├─────┼─────┼─────┤            
├───────────────┼─────┼─────┤      │     │consetetur       │     │ │cell1│cell2│cell3│            
│cell1          │cell2│cell3│      │     │sadipscing elitr.│     │ └─────┴─────┴─────┘            
├───────────────┼─────┼─────┤      ├─────┼─────────────────┼─────┤                                
│cell1          │cell2│cell3│      │cell1│cell2            │cell3│                                
└───────────────┴─────┴─────┘      └─────┴─────────────────┴─────┘                                
┌────────────────────┬─────┬─────┐ ┌───────────────┬─────┬─────┐   ┌─────┬─────┬─────────────────┐
│cell1               │cell2│cell3│ │cell1          │cell2│cell3│   │cell1│cell2│cell3            │
├────────────────────┼─────┼─────┤ ├───────────────┼─────┼─────┤   ├─────┼─────┼─────────────────┤
│takimata sanctus est│cell2│cell3│ │cell1          │cell2│cell3│   │cell1│cell2│cell3            │
│Lorem ipsum.        │     │     │ ├───────────────┼─────┼─────┤   ├─────┼─────┼─────────────────┤
├────────────────────┼─────┼─────┤ │Stet clita kasd│cell2│cell3│   │cell1│cell2│sanctus est Lorem│
│cell1               │cell2│cell3│ │gubergren, no  │     │     │   │     │     │ipsum dolor sit. │
└────────────────────┴─────┴─────┘ │sea takimata.  │     │     │   └─────┴─────┴─────────────────┘
                                   └───────────────┴─────┴─────┘                                  
┌───────────────┬─────┬─────┐      ┌─────┬─────┬────────────────┐  ┌───────────────┬─────┬─────┐  
│cell1          │cell2│cell3│      │cell1│cell2│cell3           │  │cell1          │cell2│cell3│  
├───────────────┼─────┼─────┤      ├─────┼─────┼────────────────┤  ├───────────────┼─────┼─────┤  
│sed diam nonumy│cell2│cell3│      │cell1│cell2│accusam et justo│  │cell1          │cell2│cell3│  
│eirmod tempor  │     │     │      │     │     │duo.            │  ├───────────────┼─────┼─────┤  
│invidunt ut    │     │     │      ├─────┼─────┼────────────────┤  │Stet clita kasd│cell2│cell3│  
│labore.        │     │     │      │cell1│cell2│cell3           │  │gubergren, no  │     │     │  
├───────────────┼─────┼─────┤      └─────┴─────┴────────────────┘  │sea takimata.  │     │     │  
│cell1          │cell2│cell3│                                      └───────────────┴─────┴─────┘  
└───────────────┴─────┴─────┘                                                                     `
      .slice(1),
  );
});

Deno.test("table with padding", () => {
  assertEquals(
    Table.from([
      [
        "Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        "cell2",
        "cell3",
      ],
      [
        "cell1",
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.",
        "cell3",
      ],
      [
        "cell1",
        "cell2",
        "At vero eos et accusam et justo duo dolores et ea rebum.",
      ],
    ])
      .padding(5)
      .maxColWidth(20)
      .toString(),
    `
Stet clita kasd     cell2                 cell3         
gubergren, no                                           
sea takimata                                            
sanctus est                                             
Lorem ipsum                                             
dolor sit amet.                                         
cell1               Lorem ipsum dolor     cell3         
                    sit amet,                           
                    consetetur                          
                    sadipscing elitr,                   
                    sed diam nonumy                     
                    eirmod tempor                       
                    invidunt.                           
cell1               cell2                 At vero eos et
                                          accusam et    
                                          justo duo     
                                          dolores et ea 
                                          rebum.        `.slice(1),
  );
});
