import { type Module } from "./module";

import { Debugger } from "./debugger/debugger";
import { Grammar } from "./grammar/grammar";

export class Core {
  public rootPath: string;
  public rootFile: string;
  public packagesPath: string;
  public modules: Record<string, Module<any>>;

  constructor(rootPath: string, rootFile: string, packagesPath: string) {
    this.rootPath = rootPath;
    this.rootFile = rootFile;
    this.packagesPath = packagesPath;
    this.modules = {
      Debugger: new Debugger(this),
      Grammar: new Grammar(this),
    };
  }

  public run(): void {}
}
