import { Statement } from "../statement";
import { type Token } from "../../../../lexer/other/Token";

export class Stop extends Statement {
  constructor(token: Token) {
    super(token);
  }
}
