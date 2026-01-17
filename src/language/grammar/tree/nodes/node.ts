import type { Token } from "../../lexer/other/Token";

export abstract class Node {
  public readonly token: Token;

  constructor(token: Token) {
    this.token = token;
  }
}
