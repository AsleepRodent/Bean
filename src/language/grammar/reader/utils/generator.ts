export class Generator {
  async generate(filePath: string): Promise<string> {
    const file = Bun.file(filePath);
    if (!(await file.exists())) {
      throw new Error("[indev] error: generator, file doesnt exist");
    }

    return await file.text();
  }
}
