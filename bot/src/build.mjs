import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = resolve(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(resolve(root, 'src/index.js'), resolve(dist, 'index.js'));
cpSync(resolve(root, 'src/telegram-api.js'), resolve(dist, 'telegram-api.js'));
cpSync(resolve(root, 'src/build.mjs'), resolve(dist, 'build.mjs'));
mkdirSync(resolve(dist, 'commands'), { recursive: true });
mkdirSync(resolve(dist, 'handlers'), { recursive: true });
mkdirSync(resolve(dist, 'services'), { recursive: true });
cpSync(resolve(root, 'src/commands/basic.js'), resolve(dist, 'commands/basic.js'));
cpSync(resolve(root, 'src/handlers/video-chat.js'), resolve(dist, 'handlers/video-chat.js'));
cpSync(resolve(root, 'src/services/runtime.js'), resolve(dist, 'services/runtime.js'));
console.log('Built bot package into bot/dist');
