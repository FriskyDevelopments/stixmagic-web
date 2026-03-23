import { spawn } from 'node:child_process';

const procs = [
  spawn('npm', ['run', 'dev:bot'], { stdio: 'inherit', shell: true }),
  spawn('npm', ['run', 'dev:web'], { stdio: 'inherit', shell: true }),
];

function killAll(code = 0) {
  for (const p of procs) {
    try { p.kill(); } catch { /* already exited */ }
  }
  process.exit(code);
}

for (const p of procs) {
  p.on('exit', (code) => killAll(code ?? 0));
}

process.on('SIGINT', () => killAll(0));
process.on('SIGTERM', () => killAll(0));
