import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Unary extends Expression {
  constructor(
    public readonly operator: Token,
    public readonly right: Expression,
  ) {
    super(operator);
  }
}
