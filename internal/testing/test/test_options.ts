import type { RuntimeName } from "../../runtime/runtime_name.ts";

export interface TestOptions {
  name: string;
  fn: TestFn;
  ignore?: boolean | Array<RuntimeName>;
  only?: boolean;
}

export interface TestFn {
  (t: TestContext): void | Promise<void>;
}

export interface TestContext {
  step: StepFunction;
}

export interface StepFunction {
  (stepOptions: StepOptions): Promise<boolean>;
  (name: string, fn: TestFn): Promise<boolean>;
}

export interface StepOptions {
  name: string;
  fn: TestFn;
  ignore?: boolean | Array<RuntimeName>;
  only?: boolean;
}
