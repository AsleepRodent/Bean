import { Statement } from "../statement";
import { Expression } from "../../expressions/expression";
import { type Token } from "../../../../lexer/other/Token";

export class Return extends Statement {
  constructor(
    token: Token,
    public readonly value?: Expression,
  ) {
    super(token);
  }
}
