import type { Core } from "../../core";
import type { Token } from "../lexer/other/Token";
import { TokenType } from "../lexer/other/TokenType";
import { Tree } from "../tree/tree";
import { Node } from "../tree/nodes/node";

// Declarations
import { Class } from "../tree/nodes/declarations/model/class";
import { Function } from "../tree/nodes/declarations/model/function";
import { Variable } from "../tree/nodes/declarations/model/variable";
import { Import } from "../tree/nodes/declarations/model/import";
import { Export } from "../tree/nodes/declarations/model/export";

// Statements
import { Block } from "../tree/nodes/statements/model/block";
import { If } from "../tree/nodes/statements/model/if";
import { While } from "../tree/nodes/statements/model/while";
import { For } from "../tree/nodes/statements/model/for";
import { RepeatUntil } from "../tree/nodes/statements/model/repeat";
import { Return } from "../tree/nodes/statements/model/return";
import { Try } from "../tree/nodes/statements/model/try";
import { Stop } from "../tree/nodes/statements/model/stop";
import { Continue } from "../tree/nodes/statements/model/continue";
import { ExpressionStatement } from "../tree/nodes/statements/model/expression_statement";

// Expressions
import { Expression } from "../tree/nodes/expressions/expression";
import { Binary } from "../tree/nodes/expressions/model/binary";
import { Unary } from "../tree/nodes/expressions/model/unary";
import { Logical } from "../tree/nodes/expressions/model/logical";
import { Literal } from "../tree/nodes/expressions/model/literal";
import { Identifier } from "../tree/nodes/expressions/model/identifier";
import { Call } from "../tree/nodes/expressions/model/call";
import { Get } from "../tree/nodes/expressions/model/get";
import { Set } from "../tree/nodes/expressions/model/set";
import { Grouping } from "../tree/nodes/expressions/model/grouping";
import { Self } from "../tree/nodes/expressions/model/self";
import { Super } from "../tree/nodes/expressions/model/super";
import { Await } from "../tree/nodes/expressions/model/await";
import { Table } from "../tree/nodes/expressions/model/tables";

// Other
import { Parameter } from "../tree/nodes/other/model/parameters";
import type { Grammar } from "../grammar";

export class Parser {
  private tokens: Token[] = [];
  private current = 0;
  private parent: Grammar;

  constructor(parent: Grammar) {
    this.parent = parent;
  }

  public parse(tokens: Token[]): Tree {
    this.tokens = tokens;
    this.current = 0;
    const nodes: Node[] = [];

    while (!this.isAtEnd()) {
      nodes.push(this.declaration());
    }

    return new Tree(nodes);
  }

  private declaration(): Node {
    if (this.match(TokenType.Export)) return this.exportDeclaration();
    if (this.match(TokenType.Import)) return this.importDeclaration();
    if (this.match(TokenType.Class)) return this.classDeclaration();
    if (this.match(TokenType.Function)) return this.functionDeclaration(false);
    if (this.match(TokenType.Async)) {
      this.consume(
        TokenType.Function,
        "Se esperaba 'function' después de 'async'",
      );
      return this.functionDeclaration(true);
    }
    if (this.match(TokenType.Variable)) return this.variableDeclaration();

    return this.statement();
  }

  private exportDeclaration(): Node {
    const token = this.previous();
    const decl = this.declaration();
    return new Export(token, decl as any);
  }

  private importDeclaration(): Node {
    const token = this.previous();
    const identifier = this.consume(
      TokenType.Identifier,
      "Se esperaba nombre del módulo",
    );
    let alias: Token | undefined;
    if (this.match(TokenType.As)) {
      alias = this.consume(
        TokenType.Identifier,
        "Se esperaba alias después de 'as'",
      );
    }
    this.consume(TokenType.In, "Se esperaba 'in'");
    const source = this.consume(
      TokenType.Text_Literal,
      "Se esperaba ruta del módulo",
    );
    return new Import(token, source, identifier, alias);
  }

  private classDeclaration(): Node {
    const name = this.consume(
      TokenType.Identifier,
      "Se esperaba nombre de clase",
    );
    let superclass: Token | undefined;
    if (this.match(TokenType.Is)) {
      superclass = this.consume(
        TokenType.Identifier,
        "Se esperaba nombre de superclase",
      );
    }
    this.consume(
      TokenType.Do,
      "Se esperaba 'do' para iniciar el cuerpo de la clase",
    );
    const body = this.block();
    return new Class(this.previous(), name, body, superclass);
  }

  private functionDeclaration(isAsync: boolean): Node {
    const name = this.consume(
      TokenType.Identifier,
      "Se esperaba nombre de función",
    );
    this.consume(TokenType.OpenParen, "Se esperaba '('");
    const params: Parameter[] = [];
    if (!this.check(TokenType.CloseParen)) {
      do {
        const paramName = this.consume(
          TokenType.Identifier,
          "Se esperaba nombre de parámetro",
        );
        let type: Token | undefined;
        if (this.match(TokenType.Colon)) {
          type = this.advance();
        }
        params.push(new Parameter(paramName, type));
      } while (this.match(TokenType.Comma));
    }
    this.consume(TokenType.CloseParen, "Se esperaba ')'");

    const body = this.block();
    return new Function(this.previous(), name, params, body, isAsync);
  }

  private variableDeclaration(): Node {
    const name = this.consume(
      TokenType.Identifier,
      "Se esperaba nombre de variable",
    );
    this.consume(TokenType.Equals, "Se esperaba '='");
    const initializer = this.expression();
    return new Variable(this.previous(), name, initializer);
  }

  private statement(): Node {
    if (this.match(TokenType.If)) return this.ifStatement();
    if (this.match(TokenType.While)) return this.whileStatement();
    if (this.match(TokenType.For)) return this.forStatement();
    if (this.match(TokenType.Repeat)) return this.repeatStatement();
    if (this.match(TokenType.Return)) {
      const keyword = this.previous();
      let value: Expression | undefined;
      if (!this.check(TokenType.End) && !this.check(TokenType.Else)) {
        value = this.expression();
      }
      return new Return(keyword, value);
    }
    if (this.match(TokenType.Try)) return this.tryStatement();
    if (this.match(TokenType.Stop)) return new Stop(this.previous());
    if (this.match(TokenType.Continue)) return new Continue(this.previous());
    if (this.match(TokenType.Do)) return this.block();

    return this.expressionStatement();
  }

  private ifStatement(): Node {
    const condition = this.expression();
    this.consume(TokenType.Do, "Se esperaba 'do' después de la condición");
    const thenBranch = this.block();
    let elseBranch: Block | undefined;
    if (this.match(TokenType.Else)) {
      elseBranch = this.block();
    }
    return new If(this.previous(), condition, thenBranch, elseBranch);
  }

  private whileStatement(): Node {
    const condition = this.expression();
    this.consume(TokenType.Do, "Se esperaba 'do' después de la condición");
    const body = this.block();
    return new While(this.previous(), condition, body);
  }

  private forStatement(): Node {
    const id = this.consume(TokenType.Identifier, "Se esperaba variable");
    this.consume(TokenType.In, "Se esperaba 'in'");
    const iterable = this.expression();
    this.consume(TokenType.Do, "Se esperaba 'do' antes del cuerpo del for");
    const body = this.block();
    return new For(this.previous(), id, iterable, body);
  }

  private repeatStatement(): Node {
    const token = this.previous();
    const body = this.block();
    this.consume(TokenType.Until, "Se esperaba 'until' después de repeat");
    const condition = this.expression();
    return new RepeatUntil(token, body, condition);
  }

  private tryStatement(): Node {
    const token = this.previous();
    this.consume(TokenType.Do, "Se esperaba 'do' para iniciar bloque try");
    const tryBranch = this.block();
    let catchBranch: Block | undefined;
    let excName: Token | undefined;
    if (this.match(TokenType.Catch)) {
      if (this.match(TokenType.Identifier)) excName = this.previous();
      this.consume(TokenType.Do, "Se esperaba 'do' para iniciar bloque catch");
      catchBranch = this.block();
    }
    let finallyBranch: Block | undefined;
    if (this.match(TokenType.Finally)) {
      this.consume(
        TokenType.Do,
        "Se esperaba 'do' para iniciar bloque finally",
      );
      finallyBranch = this.block();
    }
    return new Try(token, tryBranch, catchBranch, excName, finallyBranch);
  }

  private block(): Block {
    const token = this.previous();
    const statements: Node[] = [];
    while (
      !this.check(TokenType.End) &&
      !this.check(TokenType.Else) &&
      !this.isAtEnd()
    ) {
      statements.push(this.declaration());
    }
    this.consume(TokenType.End, "Se esperaba 'end' al cerrar bloque");
    return new Block(token, statements);
  }

  private expressionStatement(): Node {
    const expr = this.expression();
    return new ExpressionStatement(this.peek(), expr);
  }

  private expression(): Expression {
    return this.assignment();
  }

  private assignment(): Expression {
    const expr = this.or();
    if (this.match(TokenType.Equals)) {
      const equals = this.previous();
      const value = this.assignment();
      if (expr instanceof Get) return new Set(expr.object, expr.name, value);
      if (expr instanceof Identifier)
        return new Set(new Literal(expr.token, null), expr.token, value);
    }
    return expr;
  }

  private or(): Expression {
    let expr = this.and();
    while (this.match(TokenType.Or)) {
      const op = this.previous();
      const right = this.and();
      expr = new Logical(expr, op, right);
    }
    return expr;
  }

  private and(): Expression {
    let expr = this.equality();
    while (this.match(TokenType.And)) {
      const op = this.previous();
      const right = this.equality();
      expr = new Logical(expr, op, right);
    }
    return expr;
  }

  private equality(): Expression {
    let expr = this.comparison();
    while (this.match(TokenType.NotEqual, TokenType.EqualEqual)) {
      expr = new Binary(expr, this.previous(), this.comparison());
    }
    return expr;
  }

  private comparison(): Expression {
    let expr = this.term();
    while (
      this.match(
        TokenType.Greater,
        TokenType.GreaterEqual,
        TokenType.Less,
        TokenType.LessEqual,
      )
    ) {
      expr = new Binary(expr, this.previous(), this.term());
    }
    return expr;
  }

  private term(): Expression {
    let expr = this.factor();
    while (this.match(TokenType.Minus, TokenType.Plus)) {
      expr = new Binary(expr, this.previous(), this.factor());
    }
    return expr;
  }

  private factor(): Expression {
    let expr = this.unary();
    while (this.match(TokenType.Slash, TokenType.Star, TokenType.Percent)) {
      expr = new Binary(expr, this.previous(), this.unary());
    }
    return expr;
  }

  private unary(): Expression {
    if (this.match(TokenType.Not, TokenType.Minus, TokenType.Await)) {
      const op = this.previous();
      const right = this.unary();
      if (op.type === TokenType.Await) return new Await(op, right);
      return new Unary(op, right);
    }
    return this.call();
  }

  private call(): Expression {
    let expr = this.primary();
    while (true) {
      if (this.match(TokenType.OpenParen)) {
        const args: Expression[] = [];
        if (!this.check(TokenType.CloseParen)) {
          do {
            args.push(this.expression());
          } while (this.match(TokenType.Comma));
        }
        const paren = this.consume(TokenType.CloseParen, "Se esperaba ')'");
        expr = new Call(paren, expr, args);
      } else if (this.match(TokenType.Dot)) {
        const name = this.consume(
          TokenType.Identifier,
          "Se esperaba nombre de propiedad",
        );
        expr = new Get(expr, name);
      } else {
        break;
      }
    }
    return expr;
  }

  private primary(): Expression {
    if (this.match(TokenType.False)) return new Literal(this.previous(), false);
    if (this.match(TokenType.True)) return new Literal(this.previous(), true);
    if (this.match(TokenType.None_Type))
      return new Literal(this.previous(), null);
    if (this.match(TokenType.Number_Literal))
      return new Literal(this.previous(), parseFloat(this.previous().value));
    if (this.match(TokenType.Text_Literal))
      return new Literal(this.previous(), this.previous().value);
    if (this.match(TokenType.Self)) return new Self(this.previous());
    if (this.match(TokenType.Identifier))
      return new Identifier(this.previous());

    if (this.match(TokenType.Super)) {
      const keyword = this.previous();
      this.consume(TokenType.Dot, "Se esperaba '.'");
      const method = this.consume(TokenType.Identifier, "Se esperaba método");
      return new Super(keyword, method);
    }

    if (this.match(TokenType.OpenParen)) {
      const expr = this.expression();
      this.consume(TokenType.CloseParen, "Se esperaba ')'");
      return new Grouping(this.previous(), expr);
    }

    if (this.match(TokenType.OpenBrace)) {
      const entries: [Expression, Expression][] = [];
      if (!this.check(TokenType.CloseBrace)) {
        do {
          const key = this.expression();
          this.consume(TokenType.Colon, "Se esperaba ':'");
          const value = this.expression();
          entries.push([key, value]);
        } while (this.match(TokenType.Comma));
      }
      this.consume(TokenType.CloseBrace, "Se esperaba '}'");
      return new Table(this.previous(), entries);
    }

    throw new Error(
      `Expresión no reconocida en la línea ${this.peek().line}: ${this.peek().value}`,
    );
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    // Aquí podrías usar this.parent.modules.Debugger.error()
    throw new Error(`${message} en la línea ${this.peek().line}`);
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current]!;
  }

  private previous(): Token {
    return this.tokens[this.current - 1]!;
  }
}
