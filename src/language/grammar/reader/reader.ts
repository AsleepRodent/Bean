import { Generator } from "./utils/generator";

export class Reader {
  private _source: string = "";
  private _position: number = 0;
  private _line: number = 1;
  private _column: number = 1;
  private generator: Generator = new Generator();

  public get source(): string {
    return this._source;
  }

  public get position(): number {
    return this._position;
  }

  public get line(): number {
    return this._line;
  }

  public get column(): number {
    return this._column;
  }

  public async load(filePath: string) {
    this._source = await this.generator.generate(filePath);
  }

  public peek(): string {
    if (this.isAtEnd()) return "\0";
    return this._source[this._position] ?? "\0";
  }

  public peekNext(): string {
    if (this._position + 1 >= this._source.length) return "\0";
    return this._source[this._position + 1] ?? "\0";
  }

  public peekBack(): string {
    if (this._position <= 0) return "\0";
    return this._source[this._position - 1] ?? "\0";
  }

  public advance(): string {
    const character: string = this.peek();
    this._position++;

    if (character === "\n") {
      this._line++;
      this._column = 1;
    } else {
      this._column++;
    }

    return character;
  }

  public isAtEnd(): boolean {
    return this._position >= this._source.length;
  }
}
