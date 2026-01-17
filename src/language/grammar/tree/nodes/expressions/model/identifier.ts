import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Identifier extends Expression {
  public readonly name: string;

  constructor(token: Token) {
    super(token);
    this.name = token.value;
  }
}
