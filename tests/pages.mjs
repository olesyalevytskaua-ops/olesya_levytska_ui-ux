import { readdirSync } from 'node:fs';
export const pages = readdirSync(new URL('../docs/', import.meta.url)).filter(f => f.endsWith('.html')).sort();
