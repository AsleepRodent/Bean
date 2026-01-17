import { Statement } from "../statement";
import { Expression } from "../../expressions/expression";
import { Block } from "./block";
import { type Token } from "../../../../lexer/other/Token";

export class For extends Statement {
  constructor(
    token: Token,
    public readonly identifier: Token, // la 'i'
    public readonly iterable: Expression, // la 'lista'
    public readonly doBranch: Block,
  ) {
    super(token);
  }
}
