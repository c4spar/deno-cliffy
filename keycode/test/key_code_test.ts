import { assertEquals } from "../../dev_deps.ts";
import { KeyCode } from "../key_code.ts";
import {
  KeyMap,
  KeyMapCtrl,
  KeyMapShift,
  SpecialKeyMap,
} from "../key_codes.ts";
import type { IKey, KeyEvent } from "../key_event.ts";

const ESC = "\x1B";

const defaults = <IKey> {
  name: undefined,
  sequence: undefined,
  code: undefined,
  ctrl: false,
  meta: false,
  shift: false,
};

for (const char of "abcdefghijklmnopqrstuvwxyz123456789") {
  Deno.test(`keycode - parse key - ${char}`, function () {
    const keys: KeyEvent[] = KeyCode.parse(char);

    assertEquals(
      keys,
      <KeyEvent[]> [{
        ...defaults,
        name: char.toLowerCase(),
        sequence: char,
      }],
    );
  });
}

for (const char of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  Deno.test(`keycode - parse key - shift + ${char}`, function () {
    const keys: KeyEvent[] = KeyCode.parse(char);

    assertEquals(
      keys,
      <KeyEvent[]> [{
        ...defaults,
        name: char.toLowerCase(),
        sequence: char,
        shift: true,
      }],
    );
  });
}

for (const char of '!"§$%&/()=?,;.:-_') {
  Deno.test(`keycode - parse special key - ${char}`, function () {
    const keys: KeyEvent[] = KeyCode.parse(char);

    assertEquals(
      keys,
      <KeyEvent[]> [{
        ...defaults,
        name: undefined,
        sequence: char,
      }],
    );
  });
}

for (const code of Object.keys(SpecialKeyMap)) {
  const name = SpecialKeyMap[code];

  Deno.test(`keycode - parse key - SpecialKeyMap - ${name} (${code})`, function () {
    // const keys: KeyEvent[] = KeyCode.parse( ESC + code );
    const keys: KeyEvent[] = KeyCode.parse(code);

    assertEquals(
      keys,
      <KeyEvent[]> [{
        ...defaults,
        name,
        sequence: code,
      }],
    );
  });
}

for (const code of Object.keys(KeyMap)) {
  const name = KeyMap[code];

  Deno.test(`keycode - parse key - KeyMap - ${name} (${code})`, function () {
    const keys: KeyEvent[] = KeyCode.parse(ESC + code);

    assertEquals(
      keys,
      <KeyEvent[]> [{
        ...defaults,
        name,
        sequence: ESC + code,
        code,
      }],
    );
  });
}

for (const code of Object.keys(KeyMapShift)) {
  const name = KeyMapShift[code];

  Deno.test(`keycode - parse key - KeyMapShift - shift + ${name} (${code})`, function () {
    const keys: KeyEvent[] = KeyCode.parse(ESC + code);

    assertEquals(
      keys,
      <KeyEvent[]> [{
        ...defaults,
        name,
        sequence: ESC + code,
        code,
        shift: true,
      }],
    );
  });
}

for (const code of Object.keys(KeyMapCtrl)) {
  const name = KeyMapCtrl[code];

  Deno.test(`keycode - parse key - KeyMapCtrl - ctrl + ${name} (${code})`, function () {
    const keys: KeyEvent[] = KeyCode.parse(ESC + code);

    assertEquals(
      keys,
      <KeyEvent[]> [{
        ...defaults,
        name,
        sequence: ESC + code,
        code,
        ctrl: true,
      }],
    );
  });
}

Deno.test(`keycode - parse string - abc`, function () {
  const keys: KeyEvent[] = KeyCode.parse("abc");

  assertEquals(
    keys,
    <KeyEvent[]> [{
      ...defaults,
      name: "a",
      sequence: "a",
    }, {
      ...defaults,
      name: "b",
      sequence: "b",
    }, {
      ...defaults,
      name: "c",
      sequence: "c",
    }],
  );
});

Deno.test("keycode - xterm/gnome ESC [ letter (with modifiers)", function () {
  const keys = KeyCode.parse(
    "\x1b[2P\x1b[3P\x1b[4P\x1b[5P\x1b[6P\x1b[7P\x1b[8P\x1b[3Q\x1b[8Q\x1b[3R\x1b[8R\x1b[3S\x1b[8S",
  );
  assertEquals(keys, [
    {
      name: "f1",
      sequence: "\x1b[2P",
      code: "[P",
      shift: true,
      meta: false,
      ctrl: false,
    },
    {
      name: "f1",
      sequence: "\x1b[3P",
      code: "[P",
      shift: false,
      meta: true,
      ctrl: false,
    },
    {
      name: "f1",
      sequence: "\x1b[4P",
      code: "[P",
      shift: true,
      meta: true,
      ctrl: false,
    },
    {
      name: "f1",
      sequence: "\x1b[5P",
      code: "[P",
      shift: false,
      meta: false,
      ctrl: true,
    },
    {
      name: "f1",
      sequence: "\x1b[6P",
      code: "[P",
      shift: true,
      meta: false,
      ctrl: true,
    },
    {
      name: "f1",
      sequence: "\x1b[7P",
      code: "[P",
      shift: false,
      meta: true,
      ctrl: true,
    },
    {
      name: "f1",
      sequence: "\x1b[8P",
      code: "[P",
      shift: true,
      meta: true,
      ctrl: true,
    },
    {
      name: "f2",
      sequence: "\x1b[3Q",
      code: "[Q",
      shift: false,
      meta: true,
      ctrl: false,
    },
    {
      name: "f2",
      sequence: "\x1b[8Q",
      code: "[Q",
      shift: true,
      meta: true,
      ctrl: true,
    },
    {
      name: "f3",
      sequence: "\x1b[3R",
      code: "[R",
      shift: false,
      meta: true,
      ctrl: false,
    },
    {
      name: "f3",
      sequence: "\x1b[8R",
      code: "[R",
      shift: true,
      meta: true,
      ctrl: true,
    },
    {
      name: "f4",
      sequence: "\x1b[3S",
      code: "[S",
      shift: false,
      meta: true,
      ctrl: false,
    },
    {
      name: "f4",
      sequence: "\x1b[8S",
      code: "[S",
      shift: true,
      meta: true,
      ctrl: true,
    },
  ]);
});
