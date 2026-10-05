import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { renderDirectory } from '../src/index.mjs';
import { renderPrivacyPage } from '../src/privacy.mjs';

const run = promisify(execFile);
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'freedom-directory-build-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const directory of ['scripts', 'src', 'data']) {
    await cp(new URL(`../${directory}/`, import.meta.url), join(root, directory), { recursive: true });
  }
  const privacy = JSON.parse(await readFile(join(root, 'data/privacy-discord-bot.json'), 'utf8'));
  return { root, privacy, build: () => run(process.execPath, ['scripts/build.mjs'], { cwd: root, timeout: 10000 }) };
}

test('actual build rejects traversal before creating any output directories', async (t) => {
  const { root, privacy, build } = await fixture(t);
  const before = (await readdir(root)).sort();
  privacy.path = '../outside-dist/';
  await writeFile(join(root, 'data/privacy-discord-bot.json'), JSON.stringify(privacy));
  await assert.rejects(build(), error => error.code === 1 && /Invalid page path/.test(error.stderr));
  assert.deepEqual((await readdir(root)).sort(), before);
});

test('actual build validates privacy content before writing either artifact', async (t) => {
  const { root, privacy, build } = await fixture(t);
  const before = (await readdir(root)).sort();
  privacy.en.sections = [];
  await writeFile(join(root, 'data/privacy-discord-bot.json'), JSON.stringify(privacy));
  await assert.rejects(build(), error => error.code === 1 && /Invalid en policy/.test(error.stderr));
  assert.deepEqual((await readdir(root)).sort(), before);
});

test('actual valid build preserves both rendered artifacts', async (t) => {
  const { root, privacy, build } = await fixture(t);
  const directory = JSON.parse(await readFile(join(root, 'data/directory.json'), 'utf8'));
  await build();
  assert.equal(await readFile(join(root, 'dist/index.html'), 'utf8'), renderDirectory(directory));
  assert.equal(await readFile(join(root, 'dist', privacy.path, 'index.html'), 'utf8'), renderPrivacyPage(privacy));
});
