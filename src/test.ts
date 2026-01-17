import { Lexer } from "./language/grammar/lexer/lexer";
import { Parser } from "./language/grammar/parser/parser";
import { Grammar } from "./language/grammar/grammar";
import { Core } from "./language/core";
import { Script } from "./language/script";

const code = `
export function sumar(a: number, b: number)
    variable xdd = a + b
    return resultado
end

if 10 > 5 do
    variable mensaje = "Bean funciona"
end
`;

async function runTest() {
  try {
    // 1. Inicializar el Core con rutas ficticias para el test
    const core = new Core(process.cwd(), "main.bean", "packages");

    // 2. Obtener la instancia de Grammar ya creada por el Core
    const grammar = core.modules.Grammar as Grammar;
    const lexer = new Lexer(grammar);

    // 3. Crear el Script con todas las propiedades requeridas
    // (Añadí extension, size y tree como pide tu error ts 2739)
    const dummyScript: Script = {
      source: code,
      path: "test.bean",
      name: "test",
      extension: "bean",
      size: code.length,
      tree: null as any, // El tree se generará después
    };

    // 4. Ejecutar flujo
    const tokens = lexer.lex(dummyScript);
    const parser = new Parser();
    const tree = parser.parse(tokens);

    console.log("--- AST GENERADO ---");
    console.log(
      JSON.stringify(
        tree,
        (key, value) => {
          if (key === "script") return undefined;
          if (key === "_parent" || key === "parent") return undefined;
          return value;
        },
        2,
      ),
    );
  } catch (error) {
    console.error("Error detectado:");
    console.error(error);
  }
}

runTest();
