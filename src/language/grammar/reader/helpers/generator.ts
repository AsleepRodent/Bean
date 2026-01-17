import { Script } from "../../../script";
import type { Reader } from "../reader";

export class Generator {
  private readonly parent: Reader;

  constructor(parent: Reader) {
    this.parent = parent;
  }

  public async generate(filePath: string): Promise<Script> {
    try {
      const file = Bun.file(filePath);
      const exists = await file.exists();

      if (!exists) {
        throw new Error(); // TODO: Throw a debugger's error
      }

      const content = await file.text();

      return new Script(content, filePath);
    } catch (error: any) {
      throw error; // TODO: Throw a debugger's error
    }
  }
}
