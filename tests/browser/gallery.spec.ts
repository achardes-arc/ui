import { expect, test } from '@playwright/test';

test('auth variants, loading and errors use the same component', async ({ page }) => {
  await page.goto('/');
  const stage = page.getByTestId('auth-stage');
  await expect(stage.getByRole('heading')).toHaveText('Calque — Restricted access');
  await page.getByLabel('Example product').selectOption('Jalon');
  await expect(stage.getByRole('heading')).toHaveText('Jalon — Restricted access');
  await page.getByLabel('Show error').check();
  await expect(stage.getByRole('alert')).toContainText('not authorized');
  await page.getByLabel('Loading', { exact: true }).check();
  await expect(stage.getByRole('link')).toHaveAttribute('aria-disabled', 'true');
  await expect(stage.getByRole('link')).not.toHaveAttribute('href');
  await page.getByLabel('Loading', { exact: true }).uncheck();
  await expect(stage.getByRole('link')).toHaveAttribute('href', '#auth');
});

test('native dialog contains focus, handles nesting and restores the opener', async ({ page }) => {
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'Open example dialog', exact: true });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'A reusable dialog', exact: true });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }
  await page.getByRole('button', { name: 'Open nested dialog' }).click();
  await expect(page.getByRole('dialog', { name: 'Nested dialog', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Nested dialog', exact: true })).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Open nested dialog' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await opener.click();
  await page.mouse.click(5, 5);
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('required decision ignores backdrop and Escape but allows an explicit action', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open required decision' }).click();
  const dialog = page.getByRole('dialog', { name: 'A decision is required' });
  await page.keyboard.press('Escape');
  await page.mouse.click(5, 5);
  await expect(dialog).toBeVisible();
  await page.getByRole('button', { name: 'Acknowledge' }).click();
  await expect(dialog).not.toBeVisible();
});

for (const width of [390, 1440]) {
  test(`gallery has no horizontal overflow at ${width}px in either theme`, async ({ page }) => {
    const failures: string[] = [];
    page.on('pageerror', (error) => failures.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ['night', 'day']) {
      if (theme === 'day') await page.getByRole('banner').getByRole('button', { name: 'Switch to light' }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await expect(page.getByTestId('auth-stage').getByRole('link')).toHaveCSS('border-radius', '0px');
      await page.getByTestId('auth-stage').screenshot({ path: `test-results/auth-${theme}-${width}.png` });
    }
    expect(failures).toEqual([]);
  });
}

for (const width of [390, 1440]) {
  test(`topbar compositions stay usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#topbar');
    const stage = page.getByTestId('topbar-stage');
    const bar = stage.locator('header');
    await expect(bar).toHaveCSS('position', 'static');
    for (const theme of ['night', 'day']) {
      if (theme === 'day') await page.getByRole('banner').getByRole('button', { name: 'Switch to light' }).click();
      for (const product of ['Calque', 'Jalon', 'Cadran']) {
        await page.getByLabel('Topbar example').selectOption(product);
        await expect(bar.getByRole('link', { name: `${product}, home`, exact: true })).toBeVisible();
        if (product === 'Calque') {
          const nextTheme = theme === 'night' ? 'day' : 'night';
          await bar.getByRole('button', { name: theme === 'night' ? 'Switch to light' : 'Switch to dark' }).click();
          await expect(page.locator('html')).toHaveAttribute('data-theme', nextTheme);
          await bar.getByRole('button', { name: nextTheme === 'night' ? 'Switch to light' : 'Switch to dark' }).click();
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          await bar.getByRole('button', { name: 'Import .fig' }).click();
          await expect(stage.getByRole('status')).toContainText('Import requested');
        } else if (product === 'Jalon') {
          await expect(bar.getByRole('navigation', { name: 'Example navigation' }).locator('[aria-current="page"]')).toContainText('Board');
        } else {
          await bar.getByRole('searchbox', { name: 'Search projects' }).fill('Calque');
          await bar.getByRole('searchbox', { name: 'Search projects' }).press('Enter');
          await expect(stage.getByRole('status')).toContainText('Search requested: Calque');
        }
        await bar.getByRole('button', { name: 'Sign out' }).focus();
        await page.keyboard.press('Enter');
        await expect(stage.getByRole('status')).toContainText('Sign-out requested');
        expect(await bar.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        await stage.screenshot({ path: `test-results/topbar-${product}-${theme}-${width}.png` });
      }
    }
  });
}
