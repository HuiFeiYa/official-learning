import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
class Main {
  constructor() {
    this.publicURL = path.join(__dirname, "../../../public");
    this.targetURL = path.join(__dirname, "./target");
  }
  async copy(source, dest) {
    const res = await fs.cp(source, dest, {recursive: true, filter: (srcPath, destPath) => {
        console.log(srcPath, destPath);
        return true;
    }});
    console.log(res);
  }
  async start() {
    try {
      await this.copy(this.publicURL, this.targetURL);
    } catch (error) {
      console.error(error);
    }
  }
}

const main = new Main();
main.start();
