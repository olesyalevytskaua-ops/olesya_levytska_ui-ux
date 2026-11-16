// Static check: every internal link points to an existing page, file and anchor.
import { readFileSync, existsSync } from 'node:fs';
import { pages } from './pages.mjs';

const docs = new URL('../docs/', import.meta.url).pathname;
const html = Object.fromEntries(pages.map(p => [p, readFileSync(docs + p, 'utf8')]));
const ids = Object.fromEntries(pages.map(p => [p, new Set([...html[p].matchAll(/\sid="([^"]+)"/g)].map(m => m[1]))]));
const errors = [];

for (const page of pages) {
  const refs = [...html[page].matchAll(/\s(?:href|src|poster)="([^"]+)"/g)].map(m => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    const [pathAndQuery, hash] = ref.split('#');
    const path = pathAndQuery.split('?')[0];
    const target = path === '' ? page : path === './' ? 'index.html' : path.replace(/^\.\//, '');
    if (!existsSync(docs + target)) { errors.push(`${page}: missing file ${ref}`); continue; }
    if (hash && target.endsWith('.html') && !ids[target]?.has(hash)) errors.push(`${page}: missing anchor ${ref}`);
  }
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Links OK: ${pages.length} pages checked.`);
