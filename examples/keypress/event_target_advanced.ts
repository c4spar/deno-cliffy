#!/usr/bin/env -S deno run --unstable

import { KeyPress, keypress, KeyPressEvent } from "../../keypress/keypress.ts";

const eventTarget: KeyPress = keypress();

const timeout = setTimeout(() => {
  // Dispose stops the event loop but not reading from stdin,
  // because there is currently no way to abort reading from stdin.
  eventTarget.dispose();
  console.log("Press any key to exit.");
}, 3000);

// Register an event listener that is called an every keypress event.
eventTarget.addEventListener("keypress", (event: KeyPressEvent) => {
  console.log("event:", event);
});

// Register an event listener that is called only once.
eventTarget.addEventListener("keypress", (event: KeyPressEvent) => {
  console.log("first:", event);
  // Prevents other listeners that was registered after this listener from being called
  event.stopImmediatePropagation();
}, {
  // Executes the listener only once
  once: true,
});

eventTarget.addEventListener("keypress", (event: KeyPressEvent) => {
  console.log("second:", event);
  // Stops the event loop and listening on keypress events.
  event.preventDefault();
  clearTimeout(timeout);
});
