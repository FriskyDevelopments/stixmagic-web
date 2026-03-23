import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const procs = [
  spawn(npmCmd, ['run', 'dev:bot'], { stdio: 'inherit' }),
  spawn(npmCmd, ['run', 'dev:web'], { stdio: 'inherit' }),
];

let exiting = false;
let exitCode = 0;
let exitedCount = 0;

function killAll(code = 0) {
  if (!exitCode) exitCode = code;
  if (exiting) return;
  exiting = true;
  for (const p of procs) {
    try { p.kill(); } catch { /* already exited */ }
  }
}

for (const p of procs) {
  p.on('exit', (code) => {
    exitedCount += 1;
    killAll(code ?? 0);
    if (exitedCount === procs.length) process.exit(exitCode);
  });
}

process.on('SIGINT', () => killAll(0));
process.on('SIGTERM', () => killAll(0));
