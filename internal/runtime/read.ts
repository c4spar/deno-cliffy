// deno-lint-ignore-file no-explicit-any

/**
 * Read from stdin.
 *
 * @internal
 * @param data Uint8Array to store the data.
 */
export async function read(data: Uint8Array): Promise<number | null> {
  // dnt-shim-ignore
  const { Deno, Bun, process } = globalThis as any;

  if (Deno) {
    return await Deno.stdin.read(data);
  } else if (Bun) {
    const reader = Bun.stdin.stream().getReader();
    const { value: buffer } = await reader.read();
    await reader.cancel();
    for (let i = 0; i < buffer.length; i++) {
      data[i] = buffer[i];
    }
    return buffer.length;
  } else if (process) {
    return await new Promise((resolve, reject) => {
      process.stdin.once("readable", () => {
        try {
          const buffer = process.stdin.read();

          if (buffer === null) {
            return resolve(null);
          }

          for (let i = 0; i < buffer.length; i++) {
            data[i] = buffer[i];
          }

          resolve(buffer.length);
        } catch (error) {
          reject(error);
        }
      });
    });
  } else {
    throw new Error("unsupported runtime");
  }
}
