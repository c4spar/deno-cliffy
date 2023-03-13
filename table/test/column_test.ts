import { colors } from "../../ansi/colors.ts";
import { Table } from "../table.ts";
import {
  assertEquals,
  assertSnapshot,
  assertType,
  IsExact,
} from "../../dev_deps.ts";

const createTable = () =>
  new Table()
    .header(["Foo", "Bar", "Baz"])
    .body([
      ["foo bar baz", "baz", "beep boop"],
      ["baz", "beep boop", "foo bar baz"],
      ["beep boop", "foo bar baz", "baz"],
    ]);

Deno.test("[table] should set border on columns", () => {
  assertEquals(
    createTable()
      .columns([{
        border: true,
      }, {
        border: false,
      }, {
        border: true,
      }])
      .toString(),
    `
┌─────────────┐             ┌─────────────┐
│ Foo         │ Bar         │ Baz         │
├─────────────┤             ├─────────────┤
│ foo bar baz │ baz         │ beep boop   │
├─────────────┤             ├─────────────┤
│ baz         │ beep boop   │ foo bar baz │
├─────────────┤             ├─────────────┤
│ beep boop   │ foo bar baz │ baz         │
└─────────────┘             └─────────────┘`.slice(1),
  );
});

Deno.test("[table] should set align on columns", () => {
  assertEquals(
    createTable()
      .columns([{
        align: "left",
      }, {
        align: "center",
      }, {
        align: "right",
      }])
      .border(true)
      .toString(),
    `
┌─────────────┬─────────────┬─────────────┐
│ Foo         │     Bar     │         Baz │
├─────────────┼─────────────┼─────────────┤
│ foo bar baz │     baz     │   beep boop │
├─────────────┼─────────────┼─────────────┤
│ baz         │  beep boop  │ foo bar baz │
├─────────────┼─────────────┼─────────────┤
│ beep boop   │ foo bar baz │         baz │
└─────────────┴─────────────┴─────────────┘`.slice(1),
  );
});

Deno.test("[table] should set width on columns", () => {
  assertEquals(
    createTable()
      .columns([{
        maxWidth: 4,
      }, {
        minWidth: 20,
      }, {
        align: "right",
      }])
      .border(true)
      .toString(),
    `
┌──────┬──────────────────────┬─────────────┐
│ Foo  │ Bar                  │         Baz │
├──────┼──────────────────────┼─────────────┤
│ foo  │ baz                  │   beep boop │
│ bar  │                      │             │
│ baz  │                      │             │
├──────┼──────────────────────┼─────────────┤
│ baz  │ beep boop            │ foo bar baz │
├──────┼──────────────────────┼─────────────┤
│ beep │ foo bar baz          │         baz │
│ boop │                      │             │
└──────┴──────────────────────┴─────────────┘`.slice(1),
  );
});

Deno.test("[table] should set padding on columns", () => {
  assertEquals(
    createTable()
      .columns([{
        padding: 5,
        align: "left",
      }, {
        padding: 5,
        minWidth: 20,
        align: "center",
      }, {
        padding: 5,
        align: "right",
      }])
      .border(true)
      .toString(),
    `
┌─────────────────────┬──────────────────────────────┬─────────────────────┐
│     Foo             │             Bar              │             Baz     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     foo bar baz     │             baz              │       beep boop     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     baz             │          beep boop           │     foo bar baz     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     beep boop       │         foo bar baz          │             baz     │
└─────────────────────┴──────────────────────────────┴─────────────────────┘`
      .slice(1),
  );
});

Deno.test("[table] should call parser and renderer callback methods", async (t) => {
  await assertSnapshot(
    t,
    createTable()
      .columns([{
        headerValue: (value) => value + "a",
        cellValue: (value) => value + "1",
        headerRenderer: colors.magenta,
        cellRenderer: colors.blue,
      }, {
        headerValue: (value) => value + "b",
        cellValue: (value) => value + "2",
        headerRenderer: colors.blue,
        cellRenderer: colors.magenta,
      }, {
        headerValue: (value) => value + "c",
        cellValue: (value) => value + "3",
        headerRenderer: colors.yellow,
        cellRenderer: colors.green,
      }])
      .border(true)
      .toString(),
  );
});

Deno.test("[table] should set column options with column method", () => {
  const table = createTable();
  table.getColumn(0)?.padding(5);
  table.getColumn(0)?.align("left");

  table.getColumn(1)?.padding(5);
  table.getColumn(1)?.minWidth(20);
  table.getColumn(1)?.align("center");

  table.getColumn(2)?.padding(5);
  table.getColumn(2)?.align("right");

  assertEquals(
    table
      .border(true)
      .toString(),
    `
┌─────────────────────┬──────────────────────────────┬─────────────────────┐
│     Foo             │             Bar              │             Baz     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     foo bar baz     │             baz              │       beep boop     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     baz             │          beep boop           │     foo bar baz     │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│     beep boop       │         foo bar baz          │             baz     │
└─────────────────────┴──────────────────────────────┴─────────────────────┘`
      .slice(1),
  );
});

/** Generic type tests */

Deno.test("[table] should have correct headerValue argument types", () => {
  new Table()
    .header([1, "2", new Date(), new RegExp(""), { foo: "bar" }] as const)
    .columns([{
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [1]>>(true);
        return 1;
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, ["2"]>>(true);
        return 1;
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [Date]>>(true);
        return 1;
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [RegExp]>>(true);
        return 1;
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [{ readonly foo: "bar" }]>>(true);
        return 1;
      },
    }]);
});

Deno.test("[table] should have correct headerValue and cellValue argument types", () => {
  new Table()
    .header([1, "2", new Date(), new RegExp(""), { foo: "bar" }] as const)
    .body([
      ["1", 2, 3, { beep: true }, [1]] as const,
      ["1", 2, "3", { beep: true }, [1]] as const,
      ["1", 2, 3, { beep: true }, [1]] as const,
    ])
    .columns([{
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [1]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, ["1"]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, ["2"]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [2]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [Date]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [3 | "3"]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [RegExp]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [{ readonly beep: true }]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [{ readonly foo: "bar" }]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [readonly [1]]>>(true);
      },
    }]);
});

Deno.test("[table] should have correct cellValue argument types", () => {
  new Table()
    .body([
      ["1", 2, 3, { beep: true }, [1]] as const,
      ["1", 2, "3", { beep: true }, [1]] as const,
      ["1", 2, 3, { beep: true }, [1]] as const,
    ])
    .columns([{
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [unknown]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, ["1"]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [unknown]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [2]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [unknown]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [3 | "3"]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [unknown]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [{ readonly beep: true }]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [unknown]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [readonly [1]]>>(true);
      },
    }]);
});

Deno.test("[table] should have correct cellValue argument types for data table", () => {
  type Data = {
    readonly firstName: string;
    readonly lastName: string;
    readonly age: number;
    readonly email: string;
  };

  new Table()
    .body([
      {
        firstName: "Gino",
        lastName: "Aicheson",
        age: 21,
        email: "gaicheson0@nydailynews.com",
      },
      {
        firstName: "Godfry",
        lastName: "Pedycan",
        age: 33,
        email: "gpedycan1@state.gov",
      },
      {
        firstName: "Loni",
        lastName: "Miller",
        age: 24,
        email: "lmiller2@chron.com",
      },
    ])
    .columns([{
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [unknown]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [Data]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [unknown]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [Data]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [unknown]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [Data]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [unknown]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [Data]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [unknown]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [Data]>>(true);
      },
    }]);
});

Deno.test("[table] should have correct cellValue argument types for data table with header", () => {
  type Data = {
    readonly firstName: string;
    readonly lastName: string;
    readonly age: number;
    readonly email: string;
  };

  new Table()
    .header([1, "2", 3] as const)
    .body([
      {
        firstName: "Gino",
        lastName: "Aicheson",
        age: 21,
        email: "gaicheson0@nydailynews.com",
      },
      {
        firstName: "Godfry",
        lastName: "Pedycan",
        age: 33,
        email: "gpedycan1@state.gov",
      },
      {
        firstName: "Loni",
        lastName: "Miller",
        age: 24,
        email: "lmiller2@chron.com",
      },
    ])
    .columns([{
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [1]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [Data]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, ["2"]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [Data]>>(true);
      },
    }, {
      headerValue: (...args) => {
        assertType<IsExact<typeof args, [3]>>(true);
      },
      cellValue: (...args) => {
        assertType<IsExact<typeof args, [Data]>>(true);
      },
    }]);
});
