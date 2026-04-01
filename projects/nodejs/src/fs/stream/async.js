import fsp from "fs/promises";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream/promises";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
class Main {
  constructor() {
    this.publicURL = path.join(__dirname, "../../../public");
    this.targetURL = path.join(__dirname, "./target");
  }
  async copy(source, dest) {
    const stat = await fsp.stat(source);
    if (stat.isDirectory()) {
      await fsp.mkdir(dest, { recursive: true });
      const fileNames = await fsp.readdir(source);
      const pList = fileNames.map(async (fileName) => {
        const targetPath = path.join(dest, fileName);
        const sourcePath = path.join(source, fileName);
        const sourceStat = await fsp.stat(sourcePath);
        if (sourceStat.isDirectory()) {
          await this.copy(sourcePath, targetPath);
        } else {
          const stream = fs.createReadStream(sourcePath);
          const writeStream = fs.createWriteStream(targetPath);
          await pipeline(stream, writeStream);
          console.log('filecopy', sourcePath);
        }
      });
      const results = await Promise.allSettled(pList);
      // 检查结果中是否有错误
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Error copying file ${fileNames[index]}:`, result.reason);
        }
      });
    } else {
      const stream = fs.createReadStream(source);
      const writeStream = fs.createWriteStream(dest);
      await pipeline(stream, writeStream);
      console.log('filecopy', source);
    }
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
