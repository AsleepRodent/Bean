import { type Core } from "./core";

export abstract class Module<T = void> {
  private _parent: Core;

  protected constructor(parent: Core) {
    this._parent = parent;
  }

  public get parent(): Core {
    return this._parent;
  }

  public abstract use(): T | Promise<T>;
}
