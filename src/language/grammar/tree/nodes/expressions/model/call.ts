import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Call extends Expression {
  constructor(
    token: Token,
    public readonly callee: Expression,
    public readonly args: Expression[],
  ) {
    super(token);
  }
}
