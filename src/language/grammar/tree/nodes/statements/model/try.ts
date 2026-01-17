import { Statement } from "../statement";
import { Block } from "./block";
import { type Token } from "../../../../lexer/other/Token";

export class Try extends Statement {
  constructor(
    token: Token,
    public readonly tryBranch: Block,
    public readonly catchBranch?: Block, // Opcional
    public readonly exceptionName?: Token, // El nombre de la variable del error
    public readonly finallyBranch?: Block, // Opcional
  ) {
    super(token);
  }
}
