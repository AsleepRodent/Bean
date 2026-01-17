import { Module } from "../module";
import type { Core } from "../core";

export class Debugger extends Module {
  public constructor(parent: Core) {
    super(parent);
  }

  public override use(): void {}
}
