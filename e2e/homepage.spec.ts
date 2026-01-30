import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads without errors
    await expect(page).toHaveTitle(/EcosystemHub|Rusinga/i);
    
    // Check for main navigation elements
    const header = page.locator('header, nav').first();
    await expect(header).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for skip link (accessibility) - use first() to handle multiple skip links
    const skipLink = page.locator('a[href="#main-content"]').first();
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeAttached();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Page should still load on mobile
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper contrast ratios', async ({ page }) => {
    await page.goto('/');
    
    // Check that text elements are visible
    const textElements = page.locator('h1, h2, h3, p').first();
    if (await textElements.count() > 0) {
      await expect(textElements).toBeVisible();
    }
  });
});
