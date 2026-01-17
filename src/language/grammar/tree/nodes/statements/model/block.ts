import { Statement } from "../statement";
import { Node } from "../../node";
import { type Token } from "../../../../lexer/other/Token";

export class Block extends Statement {
  constructor(
    token: Token,
    public readonly body: Node[],
  ) {
    super(token);
  }
}
