import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPrivacyPage, validatePrivacyPage } from '../src/privacy.mjs';

const page = JSON.parse(await readFile(new URL('../data/privacy-discord-bot.json', import.meta.url), 'utf8'));

test('renders the bilingual Discord bot privacy page, zh first then en', () => {
  const html = renderPrivacyPage(page);
  const zh = html.indexOf('id="zh"');
  const en = html.indexOf('id="en"');
  assert.ok(zh > 0 && en > zh, 'Traditional Chinese section must precede English');
  assert.match(html, /1512175023580778668/);
  assert.match(html, /Effective date: September 28, 2026/);
  assert.match(html, /生效日期：2026 年 9 月 28 日/);
  assert.match(html, /Server Members or Presence/);
  assert.match(html, /<a href="mailto:ted@ted-h.com">/);
  assert.match(html, /default-src 'none'/);
  assert.doesNotMatch(html, /<script/i);
});

test('escapes data and never passes raw HTML through', () => {
  const evil = structuredClone(page);
  evil.en.sections[0].blocks[0].p = '<img src=x onerror=alert(1)> https://example.com/a';
  const html = renderPrivacyPage(evil);
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /&lt;img/);
  assert.match(html, /<a href="https:\/\/example.com\/a"/);
});

test('rejects malformed pages', () => {
  assert.throws(() => validatePrivacyPage({ ...page, schema_version: 'x' }));
  assert.throws(() => validatePrivacyPage({ ...page, path: '../etc/' }));
  const empty = structuredClone(page);
  empty.zh.sections = [];
  assert.throws(() => validatePrivacyPage(empty));
});

test('does not swallow sentence-ending periods into links', () => {
  const html = renderPrivacyPage(page);
  assert.doesNotMatch(html, /href="[^"]*\."/);
});
