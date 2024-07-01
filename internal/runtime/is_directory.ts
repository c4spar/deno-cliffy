import { stat } from "./stat.ts";

export async function isDirectory(path: string): Promise<boolean> {
  try {
    const { isDirectory } = await stat(path);
    return isDirectory;
  } catch {
    return false;
  }
}
