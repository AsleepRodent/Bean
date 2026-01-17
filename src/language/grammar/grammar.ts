import { Module } from "../module";
import { type Core } from "../core";

import { Reader } from "./reader/reader";
import { Lexer } from "./lexer/lexer";
import { Parser } from "./parser/parser";

export class Grammar extends Module<Map<string, any>> {
  public readonly reader: Reader;
  public readonly lexer: Lexer;
  public readonly parser: Parser;

  private processed: Map<string, any>;
  private queue: string[];

  constructor(parent: Core) {
    super(parent);
    this.reader = new Reader(this);
    this.lexer = new Lexer(this);
    this.parser = new Parser(this);

    this.processed = new Map();
    this.queue = [];
  }

  public override async use(): Promise<Map<string, any>> {
    this.queue.push(this.parent.rootFile);

    while (this.queue.length > 0) {
      const currentPath = this.queue.shift()!;
      if (this.processed.has(currentPath)) continue;

      const file = await this.reader.read(currentPath);
      if (!file) continue;

      const tokens = this.lexer.lex(file);

      const tree = this.parser.parse(tokens);

      this.processed.set(currentPath, tree);

      // TODO: Add file's/pacakge's imports to the queue
    }

    return this.processed;
  }
}
