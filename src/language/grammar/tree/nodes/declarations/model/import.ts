import { Declaration } from "../declaration";
import { type Token } from "../../../../lexer/other/Token";

export class Import extends Declaration {
  constructor(
    token: Token,
    public readonly source: Token,
    public readonly identifier: Token,
    public readonly alias?: Token,
  ) {
    super(token);
  }
}
