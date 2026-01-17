import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Get extends Expression {
  constructor(
    public readonly object: Expression,
    public readonly name: Token,
  ) {
    super(name);
  }
}
