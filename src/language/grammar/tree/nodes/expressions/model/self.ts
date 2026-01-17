import { Expression } from "../expression";
import { type Token } from "../../../../lexer/other/Token";

export class Self extends Expression {
  constructor(token: Token) {
    super(token);
  }
}
