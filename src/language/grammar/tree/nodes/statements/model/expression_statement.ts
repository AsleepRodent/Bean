import { Statement } from "../statement";
import { Expression } from "../../expressions/expression";
import { type Token } from "../../../../lexer/other/Token";

export class ExpressionStatement extends Statement {
  constructor(
    token: Token,
    public readonly expression: Expression,
  ) {
    super(token);
  }
}
