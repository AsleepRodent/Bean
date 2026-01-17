export enum TokenType {
  // Symbols
  OpenBrace,
  CloseBrace,
  OpenParen,
  CloseParen,

  Dot,
  Comma,
  Colon,

  // Arithmetics
  Plus,
  Minus,
  Star,
  Slash,
  Percent,

  // Assignments
  Equals,
  PlusEquals,
  MinusEquals,

  // Comparison
  EqualEqual,
  NotEqual,
  Greater,
  Less,
  GreaterEqual,
  LessEqual,
  Arrow,

  // Keywords
  Function,
  Variable,
  Class,
  Public,
  Private,
  Protected,
  Do,
  Is,
  In,
  Or,
  As,
  And,
  Not,
  End,
  For,
  If,
  Else,
  While,
  Stop,
  Continue,
  Repeat,
  Until,
  Async,
  Await,
  Return,
  Super,
  Self,
  Try,
  Catch,
  Finally,
  Import,
  Export,
  True,
  False,

  // Literals
  Identifier,
  Number_Literal,
  Text_Literal,

  // Types
  Text_Type,
  Number_Type,
  Boolean_Type,
  Table_Type,
  None_Type,
  Any_Type,

  // Other
  EOF,
  Comment,
  Unknown,
}
