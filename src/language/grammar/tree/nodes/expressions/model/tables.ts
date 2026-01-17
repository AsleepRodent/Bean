import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Table extends Expression {
  constructor(
    token: Token,
    public readonly entries: [Expression, Expression][],
  ) {
    super(token);
  }
}
