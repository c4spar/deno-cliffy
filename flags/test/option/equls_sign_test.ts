import { assertEquals } from "../../../dev_deps.ts";
import { parseFlags } from "../../flags.ts";

Deno.test("[flags] should parse required value with equals sign", () => {
  const { flags, unknown, literal } = parseFlags(["--foo=bar"], {
    flags: [{
      name: "foo",
      type: "string",
      equalsSign: true,
    }],
  });

  assertEquals(flags, { foo: "bar" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("[flags] should parse optional value with equals sign", () => {
  const { flags, unknown, literal } = parseFlags(["--foo=bar"], {
    flags: [{
      name: "foo",
      type: "string",
      equalsSign: true,
      optionalValue: true,
    }],
  });

  assertEquals(flags, { foo: "bar" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("[flags] should parse required value without equals sign", () => {
  const { flags, unknown, literal } = parseFlags(["--foo", "bar"], {
    flags: [{
      name: "foo",
      type: "string",
      equalsSign: true,
    }],
  });

  assertEquals(flags, { foo: "bar" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("[flags] should parse optional value without equals sign as argument", () => {
  const { flags, unknown, literal } = parseFlags(["--foo", "bar"], {
    flags: [{
      name: "foo",
      type: "string",
      equalsSign: true,
      optionalValue: true,
    }],
  });

  assertEquals(flags, { foo: true });
  assertEquals(unknown, ["bar"]);
  assertEquals(literal, []);
});

Deno.test("[flags] should parse optional value with leading dash with equals sign", () => {
  const { flags, unknown, literal } = parseFlags(["--foo=-bar"], {
    flags: [{
      name: "foo",
      type: "string",
      equalsSign: true,
      optionalValue: true,
    }],
  });

  assertEquals(flags, { foo: "-bar" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("[flags] should parse multi short flag with equals sign", () => {
  const { flags, unknown, literal } = parseFlags(["-abc=foo"]);

  assertEquals(flags, { a: true, b: true, c: "foo" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});

Deno.test("[flags] should parse multi short flag with required equals sign", () => {
  const { flags, unknown, literal } = parseFlags(["-abc=foo"], {
    flags: [{
      name: "a",
    }, {
      name: "b",
    }, {
      name: "c",
      type: "string",
      equalsSign: true,
    }],
  });

  assertEquals(flags, { a: true, b: true, c: "foo" });
  assertEquals(unknown, []);
  assertEquals(literal, []);
});
