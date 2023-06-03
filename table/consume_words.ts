import { strLength } from "./_utils.ts";

export function consumeWords(length: number, content: string): string {
  let consumed = "";
  const words: Array<string> = content.split("\n")[0]?.split(/ /g);

  for (let i = 0; i < words.length; i++) {
    const word: string = words[i];

    // consume minimum one word
    if (consumed) {
      const nextLength = strLength(word);
      const consumedLength = strLength(consumed);
      if (consumedLength + nextLength >= length) {
        break;
      }
    }

    consumed += (i > 0 ? " " : "") + word;
  }

  return consumed;
}
