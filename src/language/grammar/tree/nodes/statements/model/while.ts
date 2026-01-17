import { Statement } from "../statement";
import { Expression } from "../../expressions/expression";
import { Block } from "./block";
import { type Token } from "../../../../lexer/other/Token";

export class While extends Statement {
  constructor(
    token: Token,
    public readonly condition: Expression,
    public readonly doBranch: Block, // Consistencia con el IF
  ) {
    super(token);
  }
}
