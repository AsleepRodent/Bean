import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Binary extends Expression {
  constructor(
    public readonly left: Expression,
    public readonly operator: Token,
    public readonly right: Expression,
  ) {
    super(operator);
  }
}
