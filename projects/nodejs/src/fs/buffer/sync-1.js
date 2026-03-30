import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
/**
 * 读取 ../../../public 目录到 当前目录下，然后过2s都删除
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));




class Main {
    constructor() {
        this.publicURL = path.join(__dirname, '../../../public');
        this.targetURL = path.join(__dirname, './target');
    }
   
    copy(source, dest) {
       try {
        const exists = fs.existsSync(dest);
        if (!exists) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const stat = fs.statSync(source);
        if (stat.isDirectory()) {
            const fileNameList = fs.readdirSync(source);
            fileNameList.forEach(fileName => {
                const sourcePath = path.join(source, fileName);
                const targetPath = path.join(dest, fileName);
                const sourceStat = fs.statSync(sourcePath);
                if (sourceStat.isDirectory()) {
                    this.copy(sourcePath, targetPath);
                } else {
                     const buffer = fs.readFileSync(sourcePath);
                     fs.writeFileSync(targetPath, buffer);
                }
            })
        } else {
            const buffer = fs.readFileSync(source);
            fs.writeFileSync(dest, buffer);
        }
       } catch (error) {
           console.error(error);
       }
    }
    start() {
        this.copy(this.publicURL, this.targetURL);
    }
}
const main = new Main();
main.start();
