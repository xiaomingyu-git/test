import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // 检查页面标题
  await expect(page).toHaveTitle(/Vue Editor/);

  // 检查主要内容区域
  const mainContent = page.locator('main, .main-content, #app');
  await expect(mainContent).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');

  // 检查是否有导航元素
  const nav = page.locator('nav, .nav, .navigation');
  if (await nav.count() > 0) {
    await expect(nav).toBeVisible();
  }
});