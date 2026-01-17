import { Node } from "./nodes/node";

export class Tree {
  public readonly statements: Node[];

  constructor(statements: Node[] = []) {
    this.statements = statements;
  }
}
