import { Declaration } from "../declaration";
import { Block } from "../../statements/model/block";
import { Parameter } from "../../other/model/parameters";
import { type Token } from "../../../../lexer/other/Token";

export class Function extends Declaration {
  constructor(
    token: Token,
    public readonly name: Token,
    public readonly params: Parameter[],
    public readonly body: Block,
    public readonly isAsync: boolean = false,
  ) {
    super(token);
  }
}
