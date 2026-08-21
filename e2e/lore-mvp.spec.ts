import { expect, test } from '@playwright/test';

const onboardingStorageKey = 'lore-onboarding-complete';
const ambientStorageKey = 'lore-ambient-enabled';
const shelfStorageKey = 'lore-shelf-v1';
const journeyStorageKey = 'lore-aura-journey-v1';
const profileStorageKey = 'lore-aura-profile-v1';

test.describe('LORE MVP homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(([onboardingKey, ambientKey, shelfKey]) => {
      window.localStorage.setItem(onboardingKey, 'false');
      window.localStorage.setItem(ambientKey, 'true');
      window.localStorage.removeItem(shelfKey);
    }, [onboardingStorageKey, ambientStorageKey, shelfStorageKey]);
  });

  test('completes the optional first-visit onboarding and persists the choice', async ({ page }) => {
    await page.goto('/');

    const dialog = page.locator('.lore-onboarding');
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    await expect(dialog.getByText('01 / THE WORLD')).toBeVisible();

    await dialog.getByRole('button', { name: /continue/i }).click();
    await expect(dialog.getByText('02 / THE ARCHIVE')).toBeVisible();
    await dialog.getByRole('button', { name: /continue/i }).click();
    await expect(dialog.getByText('03 / THE AURAS')).toBeVisible();
    await dialog.getByRole('button', { name: /continue/i }).click();
    await expect(dialog.getByText('04 / YOUR ROOM')).toBeVisible();
    await dialog.getByRole('button', { name: /enter lore/i }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Make room for the unseen.' })).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
    await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), onboardingStorageKey)).toBe('true');

    await page.reload();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('saves and removes an archive discovery on the local Shelf', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.setItem(key, 'true'), onboardingStorageKey);
    await page.goto('/#archive');

    const archiveEntry = page.locator('.lore-archive-card').filter({ hasText: 'Weather Report for an Interior' });
    await expect(archiveEntry).toBeVisible();
    await archiveEntry.getByRole('button', { name: /save to shelf/i }).click();

    await expect(archiveEntry.getByRole('button', { name: /saved/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /shelf \(1\)/i })).toBeVisible();
    await expect(page.getByRole('status')).toHaveText('Saved to your local Shelf');
    await expect(page.locator('.lore-shelf-card')).toContainText('Weather Report for an Interior');
    await expect.poll(() => page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? '[]').length, shelfStorageKey)).toBe(1);

    await page.locator('.lore-shelf-card').getByRole('button', { name: /remove/i }).click();
    await expect(page.getByText('Nothing is resting here yet.')).toBeVisible();
    await expect.poll(() => page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? '[]').length, shelfStorageKey)).toBe(0);
  });

  test('draws and filters ritual cards, then copies a shareable deep link', async ({ page, context }) => {
    await page.addInitScript((key) => window.localStorage.setItem(key, 'true'), onboardingStorageKey);
    await page.goto('/#rituals');

    await expect(page.getByRole('heading', { name: 'The Threshold' })).toBeVisible();
    const writeFilter = page.locator('.lore-ritual-controls button').filter({ hasText: /^write$/i });
    await expect(writeFilter).toBeVisible();
    await writeFilter.click();
    await expect(page.getByRole('heading', { name: 'Borrowed Weather' })).toBeVisible();
    await expect(page.getByText('1 cards in this drawer.')).toBeVisible();

    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://localhost:3000' });
    await page.getByRole('button', { name: /share this card/i }).click();
    await expect(page.getByRole('status')).toHaveText('Ritual link copied');
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('#ritual-borrowed-weather');
  });

  test('edits a cover and exports a browser-generated PNG artifact', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.setItem(key, 'true'), onboardingStorageKey);
    await page.goto('/#cover');

    await page.getByLabel('Cover title').fill('The quietest room');
    await page.getByRole('button', { name: 'Use Afterglow' }).click();
    await expect(page.locator('.lore-cover-preview')).toContainText('The quietest room');
    await expect(page.locator('.lore-cover-preview')).toContainText('Afterglow');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export png/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('lore-cover-artifact.png');
    await expect(page.getByRole('status')).toHaveText('Cover exported as a personal artifact');
  });

  test('toggles the ambient layer and persists the preference', async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.setItem(key, 'true'), onboardingStorageKey);
    await page.goto('/');

    const toggle = page.getByRole('button', { name: /ambient layer on/i });
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await toggle.click();
    await expect(page.getByRole('button', { name: /ambient layer off/i })).toHaveAttribute('aria-pressed', 'false');
    await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), ambientStorageKey)).toBe('false');
  });
});

test.describe('LORE Canon Thread', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.setItem(key, 'true'), onboardingStorageKey);
  });

  test('supports chapter deep links, keyboard reading, progress memory, and print styling', async ({ page }) => {
    await page.goto('/lore/thread/#the-room-keeps-weather');

    await expect(page.getByRole('heading', { name: 'The Canon Thread' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The room keeps weather.' })).toBeVisible();
    await expect(page.getByRole('link', { name: /02 the room keeps weather/i })).toHaveClass(/is-active/);

    await page.keyboard.press('ArrowDown');
    await expect.poll(() => page.evaluate(() => Number(localStorage.getItem('lore-thread-progress') ?? '0'))).toBeGreaterThan(0);
    await expect(page.locator('.thread-progress')).toHaveAttribute('style', /width: [1-9]\d*%/);

    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.thread-chapter-nav')).toHaveCSS('display', 'none');
    await expect(page.locator('.thread-related')).toHaveCSS('display', 'none');
  });
});


test.describe('LORE Archive MVP0', () => {
  test('shows the six-decision Archive route and persists an incomplete journey across reload', async ({ page }) => {
    await page.goto('/lore/archive');
    await expect(page.getByText('ENTER THE ARCHIVE')).toBeVisible();
    await expect(page.getByText('06 decisions')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Four weather systems/i })).toBeVisible();
    for (const aura of ['Tender Static', 'Deep Water', 'Afterglow', 'Night Bloom']) await expect(page.getByRole('heading', { name: aura, exact: true })).toBeVisible();
    await expect(page.getByText(/six choices · weighted signals · v1 ruleset/i)).toBeVisible();
    await expect(page.getByText('DECISION 01 / 06')).toBeVisible();

    await page.locator('.lore-decision-card').first().click();
    await page.locator('.lore-decision-card').first().click();
    await page.locator('.lore-decision-card').first().click();
    await expect(page.getByText('DECISION 04 / 06')).toBeVisible();
    await page.reload();
    await expect(page.getByText('DECISION 04 / 06')).toBeVisible();
    await expect.poll(() => page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? '{}').stage, journeyStorageKey)).toBe(3);
  });

  test('rehydrates an in-progress journey from the member API across devices', async ({ page }) => {
    await page.route('http://localhost:4000/**', async (route) => {
      if (route.request().url().endsWith('/lore/me')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, data: {
            member: { userId: 'member-cross-device', tenantId: 'lore-test', status: 'in_progress', currentStep: 3, lastActiveAt: '2026-08-21T12:00:00.000Z' },
            responses: [
              { userId: 'member-cross-device', questionId: 'what-stays', optionId: 'temperature', answeredAt: '2026-08-21T11:58:00.000Z' },
              { userId: 'member-cross-device', questionId: 'what-calls', optionId: 'water', answeredAt: '2026-08-21T11:59:00.000Z' },
              { userId: 'member-cross-device', questionId: 'what-makes', optionId: 'list', answeredAt: '2026-08-21T12:00:00.000Z' }
            ],
            firstDropRead: false
          } })
        });
        return;
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data: {} }) });
    });
    await page.goto('/lore/archive');
    await expect(page.getByText('DECISION 04 / 06')).toBeVisible();
    await expect.poll(() => page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? '{}').scores?.['deep-water'], journeyStorageKey)).toBe(6);
  });

  test('reveals an Aura after six choices and opens the post-discovery profile', async ({ page }) => {
    await page.goto('/lore/archive');
    for (let index = 0; index < 6; index += 1) await page.locator('.lore-decision-card').first().click();
    await expect(page.getByText('AURA REVEALED')).toBeVisible();
    await expect(page.getByRole('link', { name: /open your profile/i })).toBeVisible();
    await page.getByRole('link', { name: /open your profile/i }).click();
    await expect(page).toHaveURL(/\/lore\/profile\/\?aura=/);
    await expect(page.getByText(/PROFILE \/ /i)).toBeVisible();
  });

  test('locks the member-only drop until an Aura profile exists', async ({ page }) => {
    await page.goto('/lore/drops/the-soft-machinery');
    await expect(page.getByText('This drop is held for the private room.')).toBeVisible();

    await page.addInitScript((key) => window.localStorage.setItem(key, JSON.stringify({ auraId: 'deep-water', discoveredAt: new Date().toISOString() })), profileStorageKey);
    await page.goto('/lore/drops/the-soft-machinery');
    await expect(page.getByText('The Soft Machinery')).toBeVisible();
    await expect(page.getByText(/creative artifact for the lore archive/i)).toBeVisible();
  });

  test('exposes the admin Integrations surface without claiming a client-side credential state', async ({ page }) => {
    await page.goto('/lore/admin/integrations');
    await expect(page.getByRole('heading', { name: /give the archive one careful door/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Google Calendar' })).toBeVisible();
    await expect(page.getByText(/authenticated lore admin session is required/i)).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/access_token|refresh_token|client_secret/i);
  });
});
