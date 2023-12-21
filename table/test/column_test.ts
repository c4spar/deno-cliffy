import { Table } from "../table.ts";
import { assertSnapshot, assertType, IsExact } from "../../dev_deps.ts";
import { Row } from "../row.ts";
import { Cell } from "../cell.ts";

const createTable = () =>
  new Table()
    .header(["Foo", "Bar", "Baz"])
    .body([
      ["foo bar baz", "baz", "beep boop"],
      ["baz", "beep boop", "foo bar baz"],
      ["beep boop", "foo bar baz", "baz"],
    ]);

Deno.test({
  name: "[table] should set border on columns",
  async fn(t) {
    await assertSnapshot(
      t,
      createTable()
        .columns([{
          border: true,
        }, {
          border: false,
        }, {
          border: true,
        }])
        .toString(),
      { serializer },
    );
  },
});

Deno.test({
  name: "[table] should set align on columns",
  async fn(t) {
    await assertSnapshot(
      t,
      createTable()
        .columns([{
          align: "left",
        }, {
          align: "center",
        }, {
          align: "right",
        }])
        .border()
        .toString(),
      { serializer },
    );
  },
});

Deno.test({
  name: "[table] should set width on columns",
  async fn(t) {
    await assertSnapshot(
      t,
      createTable()
        .columns([{
          maxWidth: 4,
        }, {
          minWidth: 20,
        }, {
          align: "right",
        }])
        .border()
        .toString(),
      { serializer },
    );
  },
});

Deno.test({
  name: "[table] should set padding on columns",
  async fn(t) {
    await assertSnapshot(
      t,
      createTable()
        .columns([{
          padding: 5,
          align: "left",
        }, {
          padding: 4,
          align: "center",
        }, {
          padding: 3,
          align: "right",
        }])
        .border()
        .toString(),
      { serializer },
    );
  },
});

Deno.test({
  name: "[table] should set column options with column method",
  async fn(t) {
    const table = createTable();
    table.getColumn(0)?.padding(5);
    table.getColumn(0)?.align("left");

    table.getColumn(1)?.padding(5);
    table.getColumn(1)?.minWidth(20);
    table.getColumn(1)?.align("center");

    table.getColumn(2)?.padding(5);
    table.getColumn(2)?.align("right");

    await assertSnapshot(
      t,
      table
        .border()
        .toString(),
      { serializer },
    );
  },
});

/** Generic type tests */

Deno.test({
  name: "[table] should call headerValue",
  fn: async (t) => {
    await assertSnapshot(
      t,
      new Table()
        .border()
        .header([1, "2", new Date(1000), new RegExp(""), {
          foo: "bar",
        }])
        .columns([{
          headerValue: (value) => {
            assertType<IsExact<typeof value, 1>>(true);
            return `Header 1: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, "2">>(true);
            return `Header 2: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, Date>>(true);
            return `Header 3: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, RegExp>>(true);
            return `Header 4: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, { readonly foo: "bar" }>>(true);
            return `Header 5: ${Deno.inspect(value)}`;
          },
        }])
        .toString(),
      { serializer },
    );
  },
});

Deno.test({
  name: "[table] should call headerValue and value",
  fn: async (t) => {
    await assertSnapshot(
      t,
      new Table()
        .border()
        .header([1, "2", new Date(1000), new RegExp(""), { foo: "bar" }])
        .body([
          ["1", 2, 3, { beep: true }, [1]],
          ["1", 2, "3", { beep: true }, [1]],
          ["1", 2, 3, { beep: true }, [1]],
        ])
        .columns([{
          headerValue: (value) => {
            assertType<IsExact<typeof value, 1>>(true);
            return `Header 1: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, "1">>(true);
            return `Body 1: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, "2">>(true);
            return `Header 2: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, 2>>(true);
            return `Body 2: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, Date>>(true);
            return `Header 3: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, 3 | "3">>(true);
            return `Body 3: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, RegExp>>(true);
            return `Header 4: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, { readonly beep: true }>>(true);
            return `Body 4: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, { readonly foo: "bar" }>>(true);
            return `Header 5: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, readonly [1]>>(true);
            return `Body 5: ${Deno.inspect(value)}`;
          },
        }])
        .toString(),
      { serializer },
    );
  },
});

Deno.test({
  name: "[table] should call value",
  fn: async (t) => {
    await assertSnapshot(
      t,
      new Table()
        .border()
        .body([
          ["1", 2, 3, { beep: true }, [1]],
          ["1", 2, "3", { beep: true }, [1]],
          ["1", 2, 3, { beep: true }, [1]],
        ])
        .columns([{
          headerValue: (value) => {
            assertType<IsExact<typeof value, unknown>>(true);
            return `Header 1: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, "1">>(true);
            return `Header 1: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, unknown>>(true);
            return `Header 2: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, 2>>(true);
            return `Body 2: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, unknown>>(true);
            return `Header 3: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, 3 | "3">>(true);
            return `Body 3: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, unknown>>(true);
            return `Header 4: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, { readonly beep: true }>>(true);
            return `Body 4: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, unknown>>(true);
            return `Header 5: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, readonly [1]>>(true);
            return `Body 5: ${Deno.inspect(value)}`;
          },
        }])
        .toString(),
      { serializer },
    );
  },
});

Deno.test({
  name: "[table] should call value and headerValue with json data",
  fn: async (t) => {
    type Data =
      | {
        readonly firstName: "Gino";
        readonly lastName: "Aicheson";
        readonly age: 21;
        readonly email: "gaicheson0@nydailynews.com";
      }
      | {
        readonly firstName: "Godfry";
        readonly lastName: "Pedycan";
        readonly age: 33;
        readonly email: "gpedycan1@state.gov";
      }
      | {
        readonly firstName: "Loni";
        readonly lastName: "Miller";
        readonly age: 24;
        readonly email: "lmiller2@chron.com";
      };

    await assertSnapshot(
      t,
      new Table()
        .border()
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
          headerValue: (value) => {
            assertType<IsExact<typeof value, unknown>>(true);
            return `Header 1: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, Data>>(true);
            return `Body 1: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, unknown>>(true);
            return `Header 2: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, Data>>(true);
            return `Body 2: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, unknown>>(true);
            return `Header 3: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, Data>>(true);
            return `Body 3: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, unknown>>(true);
            return `Header 4: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, Data>>(true);
            return `Body 4: ${Deno.inspect(value)}`;
          },
        }])
        .toString(),
      { serializer },
    );
  },
});

Deno.test({
  name: "[table] should call value and headerValue with json data and header",
  fn: async (t) => {
    type Data =
      | {
        readonly firstName: "Gino";
        readonly lastName: "Aicheson";
        readonly age: 21;
        readonly email: "gaicheson0@nydailynews.com";
      }
      | {
        readonly firstName: "Godfry";
        readonly lastName: "Pedycan";
        readonly age: 33;
        readonly email: "gpedycan1@state.gov";
      }
      | {
        readonly firstName: "Loni";
        readonly lastName: "Miller";
        readonly age: 24;
        readonly email: "lmiller2@chron.com";
      };

    await assertSnapshot(
      t,
      new Table()
        .border()
        .header([1, "2", 3, "4"])
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
          headerValue: (value) => {
            assertType<IsExact<typeof value, 1>>(true);
            return `Header 1: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, Data>>(true);
            return `Body 1: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, "2">>(true);
            return `Header 2: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, Data>>(true);
            return `Body 2: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, 3>>(true);
            return `Header 3: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, Data>>(true);
            return `Body 3: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, "4">>(true);
            return `Header 4: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, Data>>(true);
            return `Body 4: ${Deno.inspect(value)}`;
          },
        }])
        .toString(),
      { serializer },
    );
  },
});

Deno.test({
  name: "[table] should call headerValue and value with Row class",
  fn: async (t) => {
    type ExpectedType = number | string | Date | RegExp | { foo: string };

    await assertSnapshot(
      t,
      new Table()
        .border()
        .header(
          Row.from(
            [1, "2", new Date(1000), new Cell(new RegExp("")), {
              foo: "bar",
            }],
          ),
        )
        .body([
          Row.from(
            [1, "2", new Date(1000), new Cell(new RegExp("")), {
              foo: "bar",
            }],
          ),
        ])
        .columns([{
          headerValue: (value) => {
            assertType<IsExact<typeof value, ExpectedType>>(true);
            return `Header 1: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, ExpectedType>>(true);
            return `Body 1: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, ExpectedType>>(true);
            return `Header 2: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, ExpectedType>>(true);
            return `Body 2: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, ExpectedType>>(true);
            return `Header 3: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, ExpectedType>>(true);
            return `Body 3: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, ExpectedType>>(true);
            return `Header 4: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, ExpectedType>>(true);
            return `Body 4: ${Deno.inspect(value)}`;
          },
        }, {
          headerValue: (value) => {
            assertType<IsExact<typeof value, ExpectedType>>(true);
            return `Header 5: ${Deno.inspect(value)}`;
          },
          value: (value) => {
            assertType<IsExact<typeof value, ExpectedType>>(true);
            return `Body 5: ${Deno.inspect(value)}`;
          },
        }])
        .toString(),
      { serializer },
    );
  },
});

Deno.test({
  name:
    "[table] should allow header with array and body with array and row class",
  fn: async (t) => {
    type ExpectedType =
      | number
      | string
      | Date
      | RegExp
      | Map<string, number>
      | { foo: string };

    const table = new Table()
      .border()
      .header(
        [1, "2", new Date(1000), new Cell(new RegExp("")), {
          foo: "bar",
        }],
      )
      .body([
        Row.from(
          [1, "2", new Date(1000), new Cell(new RegExp("")), {
            foo: "bar",
          }],
        ),
        [
          new Map<string, number>(),
          "2",
          new Date(1000),
          new Cell(new RegExp("")),
          {
            foo: "bar",
          },
        ],
      ])
      .columns([{
        headerValue: (value) => {
          assertType<IsExact<typeof value, 1>>(true);
          return `Header 1: ${Deno.inspect(value)}`;
        },
        value: (value) => {
          assertType<IsExact<typeof value, ExpectedType>>(true);
          return `Body 1: ${Deno.inspect(value)}`;
        },
      }, {
        headerValue: (value) => {
          assertType<IsExact<typeof value, "2">>(true);
          return `Header 2: ${Deno.inspect(value)}`;
        },
        value: (value) => {
          assertType<IsExact<typeof value, ExpectedType>>(true);
          return `Body 2: ${Deno.inspect(value)}`;
        },
      }, {
        headerValue: (value) => {
          assertType<IsExact<typeof value, Date>>(true);
          return `Header 3: ${Deno.inspect(value)}`;
        },
        value: (value) => {
          assertType<IsExact<typeof value, ExpectedType>>(true);
          return `Body 3: ${Deno.inspect(value)}`;
        },
      }, {
        headerValue: (value) => {
          assertType<IsExact<typeof value, RegExp>>(true);
          return `Header 4: ${Deno.inspect(value)}`;
        },
        value: (value) => {
          assertType<IsExact<typeof value, ExpectedType>>(true);
          return `Body 4: ${Deno.inspect(value)}`;
        },
      }, {
        headerValue: (value) => {
          assertType<IsExact<typeof value, { readonly foo: "bar" }>>(true);
          return `Header 5: ${Deno.inspect(value)}`;
        },
        value: (value) => {
          assertType<IsExact<typeof value, ExpectedType>>(true);
          return `Body 5: ${Deno.inspect(value)}`;
        },
      }]);

    await assertSnapshot(
      t,
      table.toString(),
      { serializer },
    );
  },
});

function serializer<T>(value: T): T {
  return value;
}
