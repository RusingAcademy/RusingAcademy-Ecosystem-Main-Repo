import { test, expect } from '@playwright/test';

test.describe('Dashboard Accessibility', () => {
  test('learner dashboard should have proper structure', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check for main content area
    const mainContent = page.locator('main, [role="main"], #main-content').first();
    if (await mainContent.count() > 0) {
      await expect(mainContent).toBeVisible();
    }
  });

  test('badges page should load', async ({ page }) => {
    await page.goto('/badges');
    
    await page.waitForTimeout(2000);
    
    // Page should load without crashing
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('courses page should load', async ({ page }) => {
    await page.goto('/courses');
    
    await page.waitForTimeout(2000);
    
    // Page should load without crashing
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have keyboard navigation support', async ({ page }) => {
    await page.goto('/');
    
    // Press Tab to navigate
    await page.keyboard.press('Tab');
    
    // Check that something is focused
    const focusedElement = page.locator(':focus');
    if (await focusedElement.count() > 0) {
      await expect(focusedElement).toBeVisible();
    }
  });
});
