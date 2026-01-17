import { Declaration } from "../declaration";
import { Expression } from "../../expressions/expression";
import { type Token } from "../../../../lexer/other/Token";

export class Variable extends Declaration {
  constructor(
    token: Token,
    public readonly identifier: Token,
    public readonly initializer: Expression,
  ) {
    super(token);
  }
}
