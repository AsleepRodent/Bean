import { Declaration } from "../declaration";
import { type Token } from "../../../../lexer/other/Token";

export class Export extends Declaration {
  constructor(
    token: Token,
    public readonly declaration: Declaration,
  ) {
    super(token);
  }
}
