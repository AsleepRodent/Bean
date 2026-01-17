import { Statement } from "../statement";
import { Expression } from "../../expressions/expression";
import { Block } from "./block";
import { type Token } from "../../../../lexer/other/Token";

export class RepeatUntil extends Statement {
  constructor(
    token: Token,
    public readonly doBranch: Block,
    public readonly condition: Expression,
  ) {
    super(token);
  }
}
