import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npm = isWindows ? 'npm.cmd' : 'npm';

function run(workspace) {
  const child = spawn(npm, ['run', 'dev', '-w', workspace], {
    stdio: 'inherit',
    shell: false
  });
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[${workspace}] exited with code ${code}`);
      process.exit(code);
    }
  });
  return child;
}

const children = [run('bot'), run('web')];

function shutdown() {
  for (const child of children) {
    child.kill();
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
