import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Main {
    constructor() {
        this.publicURL = path.join(__dirname, '../../../public');
        this.targetURL = path.join(__dirname, './target');
    }
   
    async copy(source, dest) {
        const stat = await fs.stat(source);
        if (stat.isDirectory()) {
            await fs.mkdir(dest, { recursive: true });
            const fileNames = await fs.readdir(source);
            const pList = fileNames.map(async fileName => {
                const targetPath = path.join(dest, fileName);
                const sourcePath = path.join(source, fileName);
                const sourceStat = await fs.stat(sourcePath);
                if (sourceStat.isDirectory()) {
                    await this.copy(sourcePath, targetPath);
                } else {
                     const buffer = await fs.readFile(sourcePath);
                     await fs.writeFile(targetPath, buffer);
                }
            })
            const results = await Promise.allSettled(pList);
            console.log(results);
        } else {
            const buffer = await fs.readFile(source);
            await fs.writeFile(dest, buffer);
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
