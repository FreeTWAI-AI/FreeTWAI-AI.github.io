import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { renderDirectory } from '../src/index.mjs';
import { renderPrivacyPage } from '../src/privacy.mjs';
const directory = JSON.parse(await readFile(new URL('../data/directory.json', import.meta.url), 'utf8'));
const privacy = JSON.parse(await readFile(new URL('../data/privacy-discord-bot.json', import.meta.url), 'utf8'));
// Validate both inputs, including the privacy output path, before any writes.
const directoryHtml = renderDirectory(directory);
const privacyHtml = renderPrivacyPage(privacy);
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/index.html', import.meta.url), directoryHtml);
await mkdir(new URL(`../dist/${privacy.path}`, import.meta.url), { recursive: true });
await writeFile(new URL(`../dist/${privacy.path}index.html`, import.meta.url), privacyHtml);
console.log(`Built source directory at dist/index.html and privacy page at dist/${privacy.path}index.html; deployment is done by .github/workflows/pages.yml on main.`);

// Owned source-only negative probe.
