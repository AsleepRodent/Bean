import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Literal extends Expression {
  public readonly value: any;

  constructor(token: Token, value: any) {
    super(token);
    this.value = value;
  }
}
