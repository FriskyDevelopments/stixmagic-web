/**
 * Tests for PR: Hardened deployment workflows and documented env/integration model.
 *
 * Validates that the changed config files satisfy the structural and content
 * requirements introduced by this pull request:
 *   - Workflow gate conditions (DEPLOY_PROVIDER, ENABLE_*_DEPLOY)
 *   - timeout-minutes: 20 on every job
 *   - pnpm install --frozen-lockfile everywhere (no bare pnpm install)
 *   - New .env.example variables (TELEGRAM_INIT_DATA_MAX_AGE_SECONDS, TELEGRAM_WEBHOOK_SECRET)
 *   - .gitignore entry for services/api/data/
 *   - apps/web/.eslintrc.json extending next/core-web-vitals
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

// Resolve the monorepo root relative to this test file's location.
// Path: services/api/src/tests/config.test.ts -> up 4 levels -> repo root
const ROOT = fileURLToPath(new URL('../../../../', import.meta.url));

function readFile(relativePath: string): string {
  return readFileSync(join(ROOT, relativePath), 'utf8');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Assert a string contains a substring, with a helpful message. */
function assertContains(haystack: string, needle: string, label: string): void {
  assert.ok(
    haystack.includes(needle),
    `${label}: expected to contain ${JSON.stringify(needle)}`,
  );
}

/** Assert a string does NOT contain a substring. */
function assertNotContains(haystack: string, needle: string, label: string): void {
  assert.ok(
    !haystack.includes(needle),
    `${label}: must NOT contain ${JSON.stringify(needle)}`,
  );
}

/** Assert that content has no bare pnpm install (without --frozen-lockfile or -g). */
function assertNoBarePnpmInstall(content: string, label: string): void {
  const bareInstall = content
    .split('\n')
    .filter(
      (line) =>
        /pnpm install(?! --frozen-lockfile)(?! -g)/.test(line) &&
        !line.trimStart().startsWith('#'),
    );
  assert.equal(
    bareInstall.length,
    0,
    `${label}: found bare pnpm install lines: ${bareInstall.join('; ')}`,
  );
}

// ---------------------------------------------------------------------------
// ci.yml
// ---------------------------------------------------------------------------

test('ci.yml: validate job has timeout-minutes: 20', () => {
  const content = readFile('.github/workflows/ci.yml');
  assertContains(content, 'timeout-minutes: 20', 'ci.yml');
});

test('ci.yml: install step uses --frozen-lockfile', () => {
  const content = readFile('.github/workflows/ci.yml');
  assertContains(content, 'pnpm install --frozen-lockfile', 'ci.yml');
});

test('ci.yml: no bare pnpm install without --frozen-lockfile', () => {
  const content = readFile('.github/workflows/ci.yml');
  // Lines that contain "pnpm install" must all include "--frozen-lockfile".
  // (pnpm install -g vercel is allowed because it is a global CLI tool install.)
  assertNoBarePnpmInstall(content, 'ci.yml');
});

// ---------------------------------------------------------------------------
// deploy-cf-preview.yml
// ---------------------------------------------------------------------------

test('deploy-cf-preview.yml: build job gated by DEPLOY_PROVIDER == cloudflare and ENABLE_PREVIEW_DEPLOY', () => {
  const content = readFile('.github/workflows/deploy-cf-preview.yml');
  assertContains(content, "vars.DEPLOY_PROVIDER == 'cloudflare'", 'deploy-cf-preview.yml build if');
  assertContains(content, "vars.ENABLE_PREVIEW_DEPLOY == 'true'", 'deploy-cf-preview.yml build if');
});

test('deploy-cf-preview.yml: deploy job if condition guards forks and checks provider/enable vars', () => {
  const content = readFile('.github/workflows/deploy-cf-preview.yml');
  assertContains(content, 'github.event.pull_request.head.repo.fork == false', 'deploy-cf-preview.yml deploy if fork guard');
  assertContains(content, "vars.DEPLOY_PROVIDER == 'cloudflare'", 'deploy-cf-preview.yml deploy if provider');
  assertContains(content, "vars.ENABLE_PREVIEW_DEPLOY == 'true'", 'deploy-cf-preview.yml deploy if enable');
});

test('deploy-cf-preview.yml: both jobs have timeout-minutes: 20', () => {
  const content = readFile('.github/workflows/deploy-cf-preview.yml');
  const matches = (content.match(/timeout-minutes:\s*20/g) ?? []).length;
  assert.ok(matches >= 2, `deploy-cf-preview.yml: expected at least 2 timeout-minutes: 20 entries, found ${matches}`);
});

test('deploy-cf-preview.yml: all install steps use --frozen-lockfile', () => {
  const content = readFile('.github/workflows/deploy-cf-preview.yml');
  assertNoBarePnpmInstall(content, 'deploy-cf-preview.yml');
});

test('deploy-cf-preview.yml: deploy job includes a checkout step', () => {
  const content = readFile('.github/workflows/deploy-cf-preview.yml');
  // The deploy job section starts after "deploy:" job heading.
  const idx = content.indexOf('\n  deploy:');
  assert.ok(idx !== -1, 'deploy-cf-preview.yml: deploy job section not found');
  const deploySection = content.slice(idx);
  assertContains(deploySection, 'actions/checkout@v4', 'deploy-cf-preview.yml deploy job checkout');
});

// ---------------------------------------------------------------------------
// deploy-cf-production.yml
// ---------------------------------------------------------------------------

test('deploy-cf-production.yml: build-and-deploy job gated by DEPLOY_PROVIDER == cloudflare and ENABLE_PROD_DEPLOY', () => {
  const content = readFile('.github/workflows/deploy-cf-production.yml');
  assertContains(content, "vars.DEPLOY_PROVIDER == 'cloudflare'", 'deploy-cf-production.yml');
  assertContains(content, "vars.ENABLE_PROD_DEPLOY == 'true'", 'deploy-cf-production.yml');
});

test('deploy-cf-production.yml: job has timeout-minutes: 20', () => {
  const content = readFile('.github/workflows/deploy-cf-production.yml');
  assertContains(content, 'timeout-minutes: 20', 'deploy-cf-production.yml');
});

test('deploy-cf-production.yml: install step uses --frozen-lockfile', () => {
  const content = readFile('.github/workflows/deploy-cf-production.yml');
  assertNoBarePnpmInstall(content, 'deploy-cf-production.yml');
});

// ---------------------------------------------------------------------------
// deploy-pages.yml
// ---------------------------------------------------------------------------

test('deploy-pages.yml: build job gated by DEPLOY_PROVIDER == github-pages and ENABLE_PROD_DEPLOY', () => {
  const content = readFile('.github/workflows/deploy-pages.yml');
  assertContains(content, "vars.DEPLOY_PROVIDER == 'github-pages'", 'deploy-pages.yml build if');
  assertContains(content, "vars.ENABLE_PROD_DEPLOY == 'true'", 'deploy-pages.yml build if');
});

test('deploy-pages.yml: deploy job also has gate condition (not just build)', () => {
  const content = readFile('.github/workflows/deploy-pages.yml');
  // Both jobs should be gated. Count occurrences.
  const providerMatches = (content.match(/vars\.DEPLOY_PROVIDER == 'github-pages'/g) ?? []).length;
  assert.ok(
    providerMatches >= 2,
    `deploy-pages.yml: expected DEPLOY_PROVIDER guard on both build and deploy jobs, found ${providerMatches}`,
  );
});

test('deploy-pages.yml: both jobs have timeout-minutes: 20', () => {
  const content = readFile('.github/workflows/deploy-pages.yml');
  const matches = (content.match(/timeout-minutes:\s*20/g) ?? []).length;
  assert.ok(matches >= 2, `deploy-pages.yml: expected at least 2 timeout-minutes entries, found ${matches}`);
});

test('deploy-pages.yml: install step uses --frozen-lockfile', () => {
  const content = readFile('.github/workflows/deploy-pages.yml');
  assertNoBarePnpmInstall(content, 'deploy-pages.yml');
});

// ---------------------------------------------------------------------------
// deploy-preview-pages.yml
// ---------------------------------------------------------------------------

test('deploy-preview-pages.yml: job gated by DEPLOY_PROVIDER == external-pages and ENABLE_PREVIEW_DEPLOY', () => {
  const content = readFile('.github/workflows/deploy-preview-pages.yml');
  assertContains(content, "vars.DEPLOY_PROVIDER == 'external-pages'", 'deploy-preview-pages.yml');
  assertContains(content, "vars.ENABLE_PREVIEW_DEPLOY == 'true'", 'deploy-preview-pages.yml');
});

test('deploy-preview-pages.yml: job has timeout-minutes: 20', () => {
  const content = readFile('.github/workflows/deploy-preview-pages.yml');
  assertContains(content, 'timeout-minutes: 20', 'deploy-preview-pages.yml');
});

test('deploy-preview-pages.yml: install step uses --frozen-lockfile', () => {
  const content = readFile('.github/workflows/deploy-preview-pages.yml');
  assertNoBarePnpmInstall(content, 'deploy-preview-pages.yml');
});

test('deploy-preview-pages.yml: file ends with newline (no missing trailing newline)', () => {
  const content = readFile('.github/workflows/deploy-preview-pages.yml');
  assert.ok(content.endsWith('\n'), 'deploy-preview-pages.yml: file should end with a newline');
});

// ---------------------------------------------------------------------------
// deploy-vercel-preview.yml
// ---------------------------------------------------------------------------

test('deploy-vercel-preview.yml: build job gated by DEPLOY_PROVIDER == vercel and ENABLE_PREVIEW_DEPLOY', () => {
  const content = readFile('.github/workflows/deploy-vercel-preview.yml');
  assertContains(content, "vars.DEPLOY_PROVIDER == 'vercel'", 'deploy-vercel-preview.yml build if');
  assertContains(content, "vars.ENABLE_PREVIEW_DEPLOY == 'true'", 'deploy-vercel-preview.yml build if');
});

test('deploy-vercel-preview.yml: deploy job guards forks and checks provider/enable vars', () => {
  const content = readFile('.github/workflows/deploy-vercel-preview.yml');
  assertContains(content, 'github.event.pull_request.head.repo.fork == false', 'deploy-vercel-preview.yml deploy if fork guard');
  assertContains(content, "vars.DEPLOY_PROVIDER == 'vercel'", 'deploy-vercel-preview.yml deploy if provider');
  assertContains(content, "vars.ENABLE_PREVIEW_DEPLOY == 'true'", 'deploy-vercel-preview.yml deploy if enable');
});

test('deploy-vercel-preview.yml: both jobs have timeout-minutes: 20', () => {
  const content = readFile('.github/workflows/deploy-vercel-preview.yml');
  const matches = (content.match(/timeout-minutes:\s*20/g) ?? []).length;
  assert.ok(matches >= 2, `deploy-vercel-preview.yml: expected at least 2 timeout-minutes entries, found ${matches}`);
});

test('deploy-vercel-preview.yml: all install steps use --frozen-lockfile', () => {
  const content = readFile('.github/workflows/deploy-vercel-preview.yml');
  assertNoBarePnpmInstall(content, 'deploy-vercel-preview.yml');
});

test('deploy-vercel-preview.yml: deploy job includes pnpm install --frozen-lockfile step', () => {
  const content = readFile('.github/workflows/deploy-vercel-preview.yml');
  // The deploy job section starts after "  deploy:" heading.
  const idx = content.indexOf('\n  deploy:');
  assert.ok(idx !== -1, 'deploy-vercel-preview.yml: could not find "  deploy:" job section in file');
  const deploySection = content.slice(idx);
  assertContains(deploySection, 'pnpm install --frozen-lockfile', 'deploy-vercel-preview.yml deploy job install');
});

// ---------------------------------------------------------------------------
// deploy-vercel-production.yml
// ---------------------------------------------------------------------------

test('deploy-vercel-production.yml: deploy job gated by DEPLOY_PROVIDER == vercel and ENABLE_PROD_DEPLOY', () => {
  const content = readFile('.github/workflows/deploy-vercel-production.yml');
  assertContains(content, "vars.DEPLOY_PROVIDER == 'vercel'", 'deploy-vercel-production.yml');
  assertContains(content, "vars.ENABLE_PROD_DEPLOY == 'true'", 'deploy-vercel-production.yml');
});

test('deploy-vercel-production.yml: job has timeout-minutes: 20', () => {
  const content = readFile('.github/workflows/deploy-vercel-production.yml');
  assertContains(content, 'timeout-minutes: 20', 'deploy-vercel-production.yml');
});

test('deploy-vercel-production.yml: includes pnpm install --frozen-lockfile step', () => {
  const content = readFile('.github/workflows/deploy-vercel-production.yml');
  assertContains(content, 'pnpm install --frozen-lockfile', 'deploy-vercel-production.yml');
});

test('deploy-vercel-production.yml: no bare pnpm install without --frozen-lockfile or -g', () => {
  const content = readFile('.github/workflows/deploy-vercel-production.yml');
  assertNoBarePnpmInstall(content, 'deploy-vercel-production.yml');
});

// ---------------------------------------------------------------------------
// Cross-workflow: provider exclusivity
// ---------------------------------------------------------------------------

test('cloudflare workflow does not reference vercel provider', () => {
  const cf = readFile('.github/workflows/deploy-cf-production.yml');
  assertNotContains(cf, "vars.DEPLOY_PROVIDER == 'vercel'", 'deploy-cf-production.yml');
});

test('vercel workflow does not reference cloudflare provider', () => {
  const vercel = readFile('.github/workflows/deploy-vercel-production.yml');
  assertNotContains(vercel, "vars.DEPLOY_PROVIDER == 'cloudflare'", 'deploy-vercel-production.yml');
});

test('github-pages workflow does not reference cloudflare or vercel provider', () => {
  const pages = readFile('.github/workflows/deploy-pages.yml');
  assertNotContains(pages, "vars.DEPLOY_PROVIDER == 'cloudflare'", 'deploy-pages.yml');
  assertNotContains(pages, "vars.DEPLOY_PROVIDER == 'vercel'", 'deploy-pages.yml');
});

// ---------------------------------------------------------------------------
// .env.example
// ---------------------------------------------------------------------------

test('.env.example: contains TELEGRAM_INIT_DATA_MAX_AGE_SECONDS with default of 3600', () => {
  const content = readFile('.env.example');
  assertContains(content, 'TELEGRAM_INIT_DATA_MAX_AGE_SECONDS=3600', '.env.example');
});

test('.env.example: documents TELEGRAM_WEBHOOK_SECRET as a commented variable', () => {
  const content = readFile('.env.example');
  assertContains(content, 'TELEGRAM_WEBHOOK_SECRET', '.env.example');
});

test('.env.example: contains TELEGRAM_BOT_MODE=polling default', () => {
  const content = readFile('.env.example');
  assertContains(content, 'TELEGRAM_BOT_MODE=polling', '.env.example');
});

test('.env.example: documents NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA with false default', () => {
  const content = readFile('.env.example');
  assertContains(content, 'NEXT_PUBLIC_STIXMAGIC_USE_DEMO_DATA=false', '.env.example');
});

test('.env.example: documents DEPLOY_PROVIDER, ENABLE_PROD_DEPLOY, ENABLE_PREVIEW_DEPLOY CI/CD variables', () => {
  const content = readFile('.env.example');
  assertContains(content, 'DEPLOY_PROVIDER', '.env.example');
  assertContains(content, 'ENABLE_PROD_DEPLOY', '.env.example');
  assertContains(content, 'ENABLE_PREVIEW_DEPLOY', '.env.example');
});

test('.env.example: NEXT_PUBLIC_STIXMAGIC_MANIFEST_URL is present (even if empty)', () => {
  const content = readFile('.env.example');
  assertContains(content, 'NEXT_PUBLIC_STIXMAGIC_MANIFEST_URL=', '.env.example');
});

test('.env.example: TELEGRAM_WEBHOOK_URL is commented out by default (not active)', () => {
  const content = readFile('.env.example');
  // Every line containing TELEGRAM_WEBHOOK_URL should be a comment.
  const lines = content.split('\n').filter((l) => l.includes('TELEGRAM_WEBHOOK_URL'));
  assert.ok(lines.length > 0, '.env.example: TELEGRAM_WEBHOOK_URL entry should exist');
  const activeLines = lines.filter((l) => !l.trimStart().startsWith('#'));
  assert.equal(
    activeLines.length,
    0,
    `.env.example: TELEGRAM_WEBHOOK_URL should be commented out, found active: ${activeLines.join('; ')}`,
  );
});

// ---------------------------------------------------------------------------
// .gitignore
// ---------------------------------------------------------------------------

test('.gitignore: includes services/api/data/ to exclude local API runtime data', () => {
  const content = readFile('.gitignore');
  assertContains(content, 'services/api/data/', '.gitignore');
});

test('.gitignore: still ignores .env file', () => {
  const content = readFile('.gitignore');
  // Plain ".env" line should be present
  const lines = content.split('\n');
  const hasEnv = lines.some((l) => l.trim() === '.env');
  assert.ok(hasEnv, '.gitignore: must still contain a .env entry');
});

// ---------------------------------------------------------------------------
// apps/web/.eslintrc.json
// ---------------------------------------------------------------------------

test('apps/web/.eslintrc.json: is valid JSON', () => {
  const content = readFile('apps/web/.eslintrc.json');
  assert.doesNotThrow(() => JSON.parse(content), 'apps/web/.eslintrc.json must be valid JSON');
});

test('apps/web/.eslintrc.json: extends next/core-web-vitals', () => {
  const content = readFile('apps/web/.eslintrc.json');
  const config = JSON.parse(content) as { extends?: string | string[] };
  const extendsField = Array.isArray(config.extends)
    ? config.extends
    : [config.extends];
  assert.ok(
    extendsField.includes('next/core-web-vitals'),
    `apps/web/.eslintrc.json: "extends" should include "next/core-web-vitals", got: ${JSON.stringify(config.extends)}`,
  );
});

test('apps/web/.eslintrc.json: only contains expected keys', () => {
  const content = readFile('apps/web/.eslintrc.json');
  const config = JSON.parse(content) as Record<string, unknown>;
  const keys = Object.keys(config);
  assert.ok(
    keys.includes('extends'),
    'apps/web/.eslintrc.json: must have "extends" key',
  );
  // Boundary: no accidental rule overrides or unexpected top-level keys were introduced
  const unexpectedKeys = keys.filter((k) => !['extends', 'rules', 'plugins', 'env', 'settings', 'overrides', 'parser', 'parserOptions', 'root', 'ignorePatterns', 'globals'].includes(k));
  assert.equal(
    unexpectedKeys.length,
    0,
    `apps/web/.eslintrc.json: unexpected keys: ${unexpectedKeys.join(', ')}`,
  );
});

// ---------------------------------------------------------------------------
// Regression: no workflow still uses bare "pnpm install" without flags
// ---------------------------------------------------------------------------

const WORKFLOW_FILES = [
  '.github/workflows/ci.yml',
  '.github/workflows/deploy-cf-preview.yml',
  '.github/workflows/deploy-cf-production.yml',
  '.github/workflows/deploy-pages.yml',
  '.github/workflows/deploy-preview-pages.yml',
  '.github/workflows/deploy-vercel-preview.yml',
  '.github/workflows/deploy-vercel-production.yml',
];

test('regression: no workflow uses bare pnpm install (all use --frozen-lockfile or -g flag)', () => {
  for (const file of WORKFLOW_FILES) {
    const content = readFile(file);
    assertNoBarePnpmInstall(content, file);
  }
});

test('regression: every deploy workflow (except ci) has at least one DEPLOY_PROVIDER condition', () => {
  const deployWorkflows = WORKFLOW_FILES.filter((f) => f.includes('deploy-'));
  for (const file of deployWorkflows) {
    const content = readFile(file);
    assertContains(content, 'vars.DEPLOY_PROVIDER', file);
  }
});