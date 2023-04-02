import { expect, test } from '@playwright/test';

test('navigation test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.getByRole('heading', { name: 'Winzer' })).toBeVisible();

  await expect(page.locator('h1')).toHaveText('Winzer');
  await page.goto('http://localhost:3000/login');
  await expect(page).toHaveURL('http://localhost:3000/login');
  await page.goto('http://localhost:3000/register');
  await expect(page).toHaveURL('http://localhost:3000/register');
  await page.goto('http://localhost:3000/host');
  await expect(page).toHaveURL('http://localhost:3000/host');
});
