import { assertEquals } from "../../dev_deps.ts";
import { KeyCode } from "../key-code.ts";
import {
  KeyMap,
  KeyMapCtrl,
  KeyMapShift,
  SpecialKeyMap,
} from "../key-codes.ts";
import { IKey, KeyEvent } from "../key-event.ts";

export const ESC = "\x1B";

const defaults = <IKey> {
  sequence: undefined,
  name: undefined,
  ctrl: false,
  meta: false,
  shift: false,
};

for (const char of "abcdefghijklmnopqrstuvwxyz123456789") {
  Deno.test(`parse key: ${char}`, function () {
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
  Deno.test(`parse key: shift + ${char.toLowerCase()}`, function () {
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
  Deno.test(`parse key: ${char}`, function () {
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

  Deno.test(`parse key: ${name} (${code})`, function () {
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

  Deno.test(`parse key: ${name} (${code})`, function () {
    const keys: KeyEvent[] = KeyCode.parse(ESC + code);

    assertEquals(
      keys,
      <KeyEvent[]> [{
        ...defaults,
        name,
        sequence: undefined,
      }],
    );
  });
}

for (const code of Object.keys(KeyMapShift)) {
  const name = KeyMapShift[code];

  Deno.test(`parse key: shift + ${name} (${code})`, function () {
    const keys: KeyEvent[] = KeyCode.parse(ESC + code);

    assertEquals(
      keys,
      <KeyEvent[]> [{
        ...defaults,
        name,
        sequence: undefined,
        shift: true,
      }],
    );
  });
}

for (const code of Object.keys(KeyMapCtrl)) {
  const name = KeyMapCtrl[code];

  Deno.test(`parse key: ctrl + ${name} (${code})`, function () {
    const keys: KeyEvent[] = KeyCode.parse(ESC + code);

    assertEquals(
      keys,
      <KeyEvent[]> [{
        ...defaults,
        name,
        sequence: undefined,
        ctrl: true,
      }],
    );
  });
}

Deno.test(`parse string: abc`, function () {
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
