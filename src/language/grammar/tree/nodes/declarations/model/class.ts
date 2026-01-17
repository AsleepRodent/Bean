import { Declaration } from "../declaration";
import { Block } from "../../statements/model/block";
import { type Token } from "../../../../lexer/other/Token";

export class Class extends Declaration {
  constructor(
    token: Token,
    public readonly name: Token,
    public readonly body: Block,
    public readonly superclass?: Token,
  ) {
    super(token);
  }
}
