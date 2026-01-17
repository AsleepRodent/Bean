import { Statement } from "../statement";
import { Expression } from "../../expressions/expression";
import { Block } from "./block";
import { type Token } from "../../../../lexer/other/Token";

export class If extends Statement {
  constructor(
    token: Token,
    public readonly condition: Expression,
    public readonly doBranch: Block,
    public readonly elseBranch?: Block,
  ) {
    super(token);
  }
}
