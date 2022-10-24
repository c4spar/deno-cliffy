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
