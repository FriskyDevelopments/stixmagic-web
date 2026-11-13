import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // The dev server compiles each route on first request. Running tests in parallel makes
  // them contend for that compiler and most die on page.goto, not on a real assertion.
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 120_000 : 30_000,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ...devices['Desktop Chrome']
  },
  webServer: {
    command: 'pnpm --filter @stixmagic/web dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    // The app is a static export, so there is no "next start" to serve a prebuilt bundle.
    // Dev mode compiles each route on first request: measured 10s to boot plus 48s for the
    // first GET on a cold .next, and a next/font/google retry pushes past the old 120s.
    timeout: 300_000,
    // Without an API base URL lore-api.ts short-circuits every request, so the
    // cross-device rehydration test never reaches its route mock on :4000.
    env: {
      NEXT_PUBLIC_LORE_API_BASE_URL: 'http://localhost:4000'
    }
  }
});
