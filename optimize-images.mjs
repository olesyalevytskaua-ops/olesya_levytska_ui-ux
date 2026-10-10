// Optimize portfolio images → WebP.
// Usage (from repo root):  npm i -D sharp  &&  node optimize-images.mjs
// Output goes next to the originals as .webp; PNGs are left untouched so you can compare first.

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = "docs/images";
const QUALITY = 80;          // 75–82 is the sweet spot for UI screenshots
const MAX_W = 1600;          // desktop images never need more than this
const SLICE_H = 2400;        // tall case images get cut into sections (WebP max is 16383px)
const SPECIAL = {            // per-file overrides
  "olesya-portrait.png": { width: 256 },   // shown as a small avatar
  "olesya-banner.png":   { width: 1600 },
};

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(png|jpe?g)$/i.test(e.name)) yield p;
  }
}

const kb = (b) => `${Math.round(b / 1024)} KB`;
let before = 0, after = 0;

for await (const file of walk(ROOT)) {
  const name = path.basename(file);
  const base = file.replace(/\.(png|jpe?g)$/i, "");
  const width = SPECIAL[name]?.width ?? MAX_W;
  const meta = await sharp(file).metadata();
  const scale = Math.min(1, width / meta.width);
  const h = Math.round(meta.height * scale);
  const src = await stat(file);
  before += src.size;

  // Resize once, then either save whole or slice.
  const resized = await sharp(file).resize({ width: Math.min(width, meta.width) }).toBuffer();

  if (h <= SLICE_H * 1.25) {
    const out = `${base}.webp`;
    await sharp(resized).webp({ quality: QUALITY, effort: 6 }).toFile(out);
    const s = (await stat(out)).size; after += s;
    console.log(`${name}: ${kb(src.size)} → ${kb(s)}`);
  } else {
    const w = Math.round(meta.width * scale);
    let i = 1, total = 0;
    for (let top = 0; top < h; top += SLICE_H, i++) {
      const out = `${base}-${String(i).padStart(2, "0")}.webp`;
      await sharp(resized)
        .extract({ left: 0, top, width: w, height: Math.min(SLICE_H, h - top) })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(out);
      total += (await stat(out)).size;
    }
    after += total;
    console.log(`${name}: ${kb(src.size)} → ${i - 1} slices, ${kb(total)} total`);
  }
}

console.log(`\nTotal: ${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB`);
