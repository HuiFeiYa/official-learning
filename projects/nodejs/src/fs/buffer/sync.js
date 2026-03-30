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
   
    lookupDeep(url, targetURL, relativePath = '') {
        const stats = fs.statSync(url);
        
        if (stats.isDirectory()) {
            const fileNameList = fs.readdirSync(url);
            const targetPath = path.join(targetURL, relativePath);
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath);
            }
            fileNameList.forEach(fileName => {
                this.lookupDeep(path.join(url, fileName), targetPath, fileName);
            })  
        } else {
            const buffer = fs.readFileSync(url);
            const fileName = path.basename(url);
            fs.writeFileSync(path.resolve(targetURL, fileName), buffer);
        }
    }
    start() {
        this.lookupDeep(this.publicURL, this.targetURL);
    }
}
const main = new Main();
main.start();
