import { test, expect } from '@playwright/test';

test('theme toggle switches and remembers the theme', async ({ page }) => {
  await page.addInitScript(() => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('theme', 'light'); sessionStorage.setItem('seeded', '1'); } });
  await page.goto('./');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.locator('[data-theme-toggle]').first().click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});

test('CV is one tap away on the home hero (mobile only)', async ({ page }, info) => {
  await page.goto('./');
  const cv = page.locator('.hero-cv-cta');
  if (info.project.name === 'mobile') {
    await expect(cv).toBeVisible();
    await expect(cv).toHaveAttribute('href', 'cv.html');
  } else {
    await expect(cv).toBeHidden();
    await expect(page.locator('header nav a[href="cv.html"]')).toBeVisible();
  }
});

test('main navigation reaches every core page', async ({ page }, info) => {
  for (const [label, href] of [['Work', 'work.html'], ['About', 'about.html'], ['Insights', 'insights.html'], ['CV', 'cv.html']]) {
    await page.goto('./');
    if (info.project.name === 'mobile') await page.locator('.menu-toggle').click();
    await page.locator('header nav').getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(href));
    await expect(page.locator('h1')).toBeVisible();
  }
});

test('Contact opens the contact dialog and closes with Escape', async ({ page }, info) => {
  await page.goto('./');
  if (info.project.name === 'mobile') await page.locator('.menu-toggle').click();
  await page.locator('header nav').getByRole('link', { name: 'Contact', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Olesya Levytska' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('downloadable CV PDF exists', async ({ request }) => {
  const res = await request.get('Olesya-Levytska-CV.pdf');
  expect(res.ok()).toBeTruthy();
  expect(res.headers()['content-type']).toContain('pdf');
});
