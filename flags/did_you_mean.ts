import { IFlagOptions } from "./types.ts";

export function didYouMeanOption(option: string, options: Array<IFlagOptions>) {
  const match: string | null = options.length
    ? closest(
      option,
      options
        .map((option) => [option.name, ...(option.aliases ?? [])])
        .reduce(
          (prev, cur) => {
            prev.push(...cur);
            return prev;
          },
          [],
        ),
    )
    : null;
  return match ? `Did you mean option ${getFlag(match)}?` : "";
}

export function didYouMeanType(type: string, types: Array<string>) {
  return `Did you mean type ${closest(type, types)}?`;
}

export function didYouMean(type: string, types: Array<string>) {
  return `Did you mean ${closest(type, types)}?`;
}

function getFlag(name: string) {
  if (name.startsWith("-")) {
    return name;
  }
  if (name.length > 1) {
    return `--${name}`;
  }
  return `-${name}`;
}

function distance(a: string, b: string) {
  if (a.length == 0) {
    return b.length;
  }
  if (b.length == 0) {
    return a.length;
  }
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1),
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function closest(str: string, arr: string[]): string {
  let minDistance = Infinity;
  let minIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    const dist = distance(str, arr[i]);
    if (dist < minDistance) {
      minDistance = dist;
      minIndex = i;
    }
  }
  return arr[minIndex];
}
