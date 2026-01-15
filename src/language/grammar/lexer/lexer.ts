import { Reader } from "../reader/reader";
import { Token } from "./other/token";
import { TokenType } from "./other/token_type";

export class Lexer {
  private reader: Reader;
  private tokens: Token[] = [];
  private start: number = 0;

  private static readonly KEYWORDS: Record<string, TokenType> = {
    any: TokenType.ANY_TYPE,
    none: TokenType.NONE,
    text: TokenType.TEXT,
    number: TokenType.NUMBER,
    boolean: TokenType.BOOLEAN,
    table: TokenType.TABLE,
    class: TokenType.CLASS,
    function: TokenType.FUNCTION,
    true: TokenType.TRUE,
    false: TokenType.FALSE,
    do: TokenType.DO,
    is: TokenType.IS,
    or: TokenType.OR,
    in: TokenType.IN,
    and: TokenType.AND,
    from: TokenType.FROM,
    if: TokenType.IF,
    else: TokenType.ELSE,
    for: TokenType.FOR,
    while: TokenType.WHILE,
    return: TokenType.RETURN,
    super: TokenType.SUPER,
    self: TokenType.SELF,
  };

  constructor(reader: Reader) {
    this.reader = reader;
  }

  public scanTokens(): Token[] {
    while (!this.reader.isAtEnd()) {
      this.start = this.reader.position;
      this.scanToken();
    }

    this.tokens.push(
      new Token(TokenType.EOF, "", null, this.reader.line, this.reader.column),
    );

    return this.tokens;
  }

  private scanToken(): void {
    const char = this.reader.advance();

    switch (char) {
      case "(":
        this.addToken(TokenType.L_PAREN);
        break;
      case ")":
        this.addToken(TokenType.R_PAREN);
        break;
      case "{":
        this.addToken(TokenType.L_BRACE);
        break;
      case "}":
        this.addToken(TokenType.R_BRACE);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;

      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER,
        );
        break;

      case "/":
        if (this.match("/")) {
          while (this.reader.peek() !== "\n" && !this.reader.isAtEnd())
            this.reader.advance();
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;

      case " ":
      case "\r":
      case "\t":
      case "\n":
        break;

      case '"':
        this.readText();
        break;

      default:
        if (this.isDigit(char)) {
          this.readNumber();
        } else if (this.isAlpha(char)) {
          this.readIdentifier();
        } else {
          console.error(
            `[Lexer] Error: Carácter inesperado '${char}' en línea ${this.reader.line}`,
          );
        }
        break;
    }
  }

  private readText(): void {
    while (this.reader.peek() !== '"' && !this.reader.isAtEnd()) {
      this.reader.advance();
    }

    if (this.reader.isAtEnd()) {
      console.error(`[Lexer] Texto sin cerrar en línea ${this.reader.line}`);
      return;
    }

    this.reader.advance(); // Cerrar comillas
    const value = this.reader.source.substring(
      this.start + 1,
      this.reader.position - 1,
    );
    this.addToken(TokenType.TEXT, value);
  }

  private readNumber(): void {
    while (this.isDigit(this.reader.peek())) this.reader.advance();

    if (this.reader.peek() === "." && this.isDigit(this.reader.peekNext())) {
      this.reader.advance();
      while (this.isDigit(this.reader.peek())) this.reader.advance();
    }

    const valueStr = this.reader.source.substring(
      this.start,
      this.reader.position,
    );
    this.addToken(TokenType.NUMBER, parseFloat(valueStr));
  }

  private readIdentifier(): void {
    while (this.isAlphaNumeric(this.reader.peek())) this.reader.advance();
    const text = this.reader.source.substring(this.start, this.reader.position);
    const type = Lexer.KEYWORDS[text] ?? TokenType.IDENTIFIER;
    this.addToken(type);
  }

  private match(expected: string): boolean {
    if (this.reader.isAtEnd()) return false;
    if (this.reader.peek() !== expected) return false;
    this.reader.advance();
    return true;
  }

  private isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }
  private isAlpha(char: string): boolean {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_"
    );
  }
  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private addToken(type: TokenType, literal: any = null): void {
    const raw = this.reader.source.substring(this.start, this.reader.position);
    this.tokens.push(
      new Token(type, raw, literal, this.reader.line, this.reader.column),
    );
  }
}
