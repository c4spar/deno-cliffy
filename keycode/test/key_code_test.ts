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
  sequence: undefined,
  name: undefined,
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
