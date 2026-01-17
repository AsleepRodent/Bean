import { Grammar } from "../grammar";
import { Script } from "../../script";
import { TokenType } from "./other/TokenType";
import { type Token } from "./other/Token";

const KEYWORDS: Record<string, TokenType> = {
  function: TokenType.Function,
  variable: TokenType.Variable,
  class: TokenType.Class,
  public: TokenType.Public,
  private: TokenType.Private,
  protected: TokenType.Protected,
  do: TokenType.Do,
  is: TokenType.Is,
  in: TokenType.In,
  or: TokenType.Or,
  as: TokenType.As,
  and: TokenType.And,
  not: TokenType.Not,
  end: TokenType.End,
  for: TokenType.For,
  if: TokenType.If,
  else: TokenType.Else,
  while: TokenType.While,
  stop: TokenType.Stop,
  continue: TokenType.Continue,
  repeat: TokenType.Repeat,
  until: TokenType.Until,
  async: TokenType.Async,
  await: TokenType.Await,
  return: TokenType.Return,
  super: TokenType.Super,
  self: TokenType.Self,
  try: TokenType.Try,
  catch: TokenType.Catch,
  finally: TokenType.Finally,
  import: TokenType.Import,
  export: TokenType.Export,
  true: TokenType.True,
  false: TokenType.False,
  text: TokenType.Text_Type,
  number: TokenType.Number_Type,
  boolean: TokenType.Boolean_Type,
  table: TokenType.Table_Type,
  none: TokenType.None_Type,
  any: TokenType.Any_Type,
};

export class Lexer {
  public readonly parent: Grammar;

  private source: string = "";
  private tokens: Token[] = [];
  private start: number = 0;
  private current: number = 0;
  private line: number = 1;
  private column: number = 1;
  private currentScript!: Script;

  constructor(parent: Grammar) {
    this.parent = parent;
  }

  public lex(script: Script): Token[] {
    this.currentScript = script;
    this.source = script.source;
    this.tokens = [];
    this.current = 0;
    this.line = 1;
    this.column = 1;

    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(this.createToken(TokenType.EOF, ""));
    return this.tokens;
  }

  private scanToken(): void {
    const char = this.advance();

    switch (char) {
      case "(":
        this.addToken(TokenType.OpenParen);
        break;
      case ")":
        this.addToken(TokenType.CloseParen);
        break;
      case "{":
        this.addToken(TokenType.OpenBrace);
        break;
      case "}":
        this.addToken(TokenType.CloseBrace);
        break;
      case ".":
        this.addToken(TokenType.Dot);
        break;
      case ",":
        this.addToken(TokenType.Comma);
        break;
      case ":":
        this.addToken(TokenType.Colon);
        break;
      case "*":
        this.addToken(TokenType.Star);
        break;
      case "%":
        this.addToken(TokenType.Percent);
        break;

      case "=":
        this.addToken(
          this.match("=") ? TokenType.EqualEqual : TokenType.Equals,
        );
        break;
      case "+":
        this.addToken(this.match("=") ? TokenType.PlusEquals : TokenType.Plus);
        break;
      case "-":
        if (this.match(">")) this.addToken(TokenType.Arrow);
        else
          this.addToken(
            this.match("=") ? TokenType.MinusEquals : TokenType.Minus,
          );
        break;
      case "!":
        if (this.match("=")) this.addToken(TokenType.NotEqual);
        else this.addToken(TokenType.Unknown);
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LessEqual : TokenType.Less);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GreaterEqual : TokenType.Greater,
        );
        break;

      case "/":
        if (this.match("/")) {
          while (this.peek() !== "\n" && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.Slash);
        }
        break;

      case " ":
      case "\r":
      case "\t":
        break;

      case "\n":
        this.line++;
        this.column = 1;
        break;

      case '"':
        this.readString();
        break;

      default:
        if (this.isDigit(char)) {
          this.readNumber();
        } else if (this.isAlpha(char)) {
          this.readIdentifier();
        } else {
          this.addToken(TokenType.Unknown);
        }
        break;
    }
  }

  private readIdentifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    const text = this.source.substring(this.start, this.current);
    const type = KEYWORDS[text] ?? TokenType.Identifier;
    this.addToken(type);
  }

  private readNumber(): void {
    while (this.isDigit(this.peek())) this.advance();

    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }

    this.addToken(TokenType.Number_Literal);
  }

  private readString(): void {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") {
        this.line++;
        this.column = 1;
      }
      this.advance();
    }

    if (this.isAtEnd()) return; // TODO: Error de debugger

    this.advance(); // Cerrar comillas
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.Text_Literal, value);
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    const char = this.source[this.current++] || "\0";
    this.column++;
    return char;
  }

  private match(expected: string): boolean {
    if (this.isAtEnd() || this.source[this.current] !== expected) return false;
    this.current++;
    this.column++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source[this.current] || "\0";
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source[this.current + 1] || "\0";
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private addToken(type: TokenType, literal?: string): void {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(this.createToken(type, literal ?? text));
  }

  private createToken(type: TokenType, value: string): Token {
    return {
      type,
      value,
      line: this.line,
      column: this.column - (this.current - this.start),
      script: this.currentScript,
    };
  }
}
