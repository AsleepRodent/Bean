import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Grouping extends Expression {
  constructor(
    token: Token,
    public readonly expression: Expression,
  ) {
    super(token);
  }
}
