import { Secret } from "../../../secret.ts";

await Secret.prompt({
  message: "enter your secret",
});
