import { Node } from "../../node";
import { type Token } from "../../../../lexer/other/Token";

export class Parameter extends Node {
  constructor(
    public readonly identifier: Token,
    public readonly typeAnnotation?: Token,
  ) {
    super(identifier);
  }
}
