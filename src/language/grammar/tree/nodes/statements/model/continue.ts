import { Statement } from "../statement";
import { type Token } from "../../../../lexer/other/Token";

export class Continue extends Statement {
  constructor(token: Token) {
    super(token);
  }
}
