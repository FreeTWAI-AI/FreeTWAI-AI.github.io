import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { renderDirectory } from '../src/index.mjs';
const directory = JSON.parse(await readFile(new URL('../data/directory.json', import.meta.url), 'utf8'));
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/index.html', import.meta.url), renderDirectory(directory));
console.log('Built source directory at dist/index.html; no Pages deployment performed.');
