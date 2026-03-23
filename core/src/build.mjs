import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = resolve(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(resolve(root, 'src/index.js'), resolve(dist, 'index.js'));
cpSync(resolve(root, 'src/config.js'), resolve(dist, 'config.js'));
cpSync(resolve(root, 'src/format.js'), resolve(dist, 'format.js'));
cpSync(resolve(root, 'src/session-store.js'), resolve(dist, 'session-store.js'));
console.log('Built core package into core/dist');
