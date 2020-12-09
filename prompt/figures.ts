const main = {
  ARROW_UP: "↑",
  ARROW_DOWN: "↓",
  ARROW_LEFT: "←",
  ARROW_RIGHT: "→",
  RADIO_ON: "◉",
  RADIO_OFF: "◯",
  TICK: "✔",
  CROSS: "✘",
  ELLIPSIS: "…",
  POINTER_SMALL: "›",
  LINE: "─",
  POINTER: "❯",
};

const win = {
  ARROW_UP: main.ARROW_UP,
  ARROW_DOWN: main.ARROW_DOWN,
  ARROW_LEFT: main.ARROW_LEFT,
  ARROW_RIGHT: main.ARROW_RIGHT,
  RADIO_ON: "(*)",
  RADIO_OFF: "( )",
  TICK: "√",
  CROSS: "×",
  ELLIPSIS: main.ELLIPSIS,
  POINTER_SMALL: "»",
  LINE: main.LINE,
  POINTER: main.POINTER,
};

/** Prompt icons. */
export const Figures = Deno.build.os === "windows" ? win : main;
