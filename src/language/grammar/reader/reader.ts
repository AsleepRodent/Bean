import { Grammar } from "../grammar";
import { Generator } from "./helpers/generator";
import type { Script } from "../../script";

export class Reader {
  public readonly parent: Grammar;
  public readonly generator: Generator;

  constructor(parent: Grammar) {
    this.parent = parent;
    this.generator = new Generator(this);
  }

  public async read(filePath: string): Promise<Script> {
    try {
      return await this.generator.generate(filePath);
    } catch (error: any) {
      throw error; // TODO: Throw a debugger's error
    }
  }
}
