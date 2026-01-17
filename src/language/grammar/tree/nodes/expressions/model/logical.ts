import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Logical extends Expression {
  constructor(
    public readonly left: Expression,
    public readonly operator: Token,
    public readonly right: Expression,
  ) {
    super(operator);
  }
}
