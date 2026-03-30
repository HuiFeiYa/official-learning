import path from 'node:path'

const url = '/foo/bar/baz/asdf/quux.txt'
const parsed = path.parse(url)
console.log(parsed);


const base = path.basename(url);
console.log(base);

const ext = path.extname(url);
console.log(ext);

const dirname = path.dirname(url);
console.log(dirname);
