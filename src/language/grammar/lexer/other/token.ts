import { type TokenType } from "./token_type";

export class Token {
  constructor(
    public type: TokenType,
    public raw: string,
    public literal: any,
    public line: number,
    public column: number,
  ) {}
}
