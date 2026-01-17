import type { TokenType } from "./TokenType";
import type { Script } from "../../../script";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  script: Script;
}
