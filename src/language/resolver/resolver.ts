import { Module } from "../module";
import { type Core } from "../core";
import * as path from "node:path";
import * as fs from "node:fs";

export class Resolver extends Module {
  constructor(parent: Core) {
    super(parent);
  }

  public resolve(targetPath: string, originPath: string): string | null {
    if (targetPath.startsWith(".") || targetPath.startsWith("/")) {
      const absolutePath = path.resolve(path.dirname(originPath), targetPath);
      const finalPath = absolutePath.endsWith(".bean")
        ? absolutePath
        : `${absolutePath}.bean`;

      if (fs.existsSync(finalPath)) return finalPath;
    }

    const packagePath = path.join(this.parent.packagesPath, targetPath);
    const packageJsonPath = path.join(packagePath, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        if (config.entry) {
          const entryPath = path.join(packagePath, config.entry);
          if (fs.existsSync(entryPath)) return entryPath;
        }
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  public use(): void {}
}
