import { Command } from "@cliffy/command";

await new Command()
  .option("-f, --foo <val:string>", "Foo option.")
  .option("-b, --bar <val:string>", "Bar option.")
  .useRawArgs() // <-- enable raw args
  .action((options, ...args) => {
    console.log("options:", options);
    console.log("args:", args);
  })
  .parse();
