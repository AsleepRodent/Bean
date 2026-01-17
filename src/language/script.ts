export class Script {
  public readonly source: string;
  public readonly path: string;
  public readonly name: string;
  public readonly extension: string;
  public readonly size: number;
  public tree: String[];

  constructor(source: string, path: string) {
    this.source = source;
    this.path = path;

    const parts = path.split("/");
    this.name = parts.pop() || "unknown";
    this.extension = this.name.split(".").pop() || "";

    this.size = new TextEncoder().encode(source).length;
    this.tree = [];
  }
}
