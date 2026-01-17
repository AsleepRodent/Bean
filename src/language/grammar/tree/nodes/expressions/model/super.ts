import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Super extends Expression {
  constructor(
    token: Token,
    public readonly method: Token,
  ) {
    super(token);
  }
}
