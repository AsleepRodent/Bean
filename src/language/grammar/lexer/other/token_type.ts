export enum TokenType {
  // Characters
  L_PAREN,
  R_PAREN,
  L_BRACE,
  R_BRACE,
  COMMA,
  DOT,
  MINUS,
  PLUS,
  SLASH,
  STAR,
  BANG,
  BANG_EQUAL,
  EQUAL,
  EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,
  IDENTIFIER,

  // Types
  ANY_TYPE,
  NONE,
  TEXT,
  NUMBER,
  BOOLEAN,
  TABLE,
  CLASS,
  FUNCTION,

  // Values
  TRUE,
  FALSE,

  // Keywords
  DO,
  IS,
  OR,
  IN,
  AND,
  FROM,
  IF,
  ELSE,
  FOR,
  WHILE,
  RETURN,
  SUPER,
  SELF,

  EOF,
}
