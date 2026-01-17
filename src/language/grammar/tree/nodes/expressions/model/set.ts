import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Set extends Expression {
  constructor(
    public readonly object: Expression,
    public readonly name: Token,
    public readonly value: Expression,
  ) {
    super(name);
  }
}
