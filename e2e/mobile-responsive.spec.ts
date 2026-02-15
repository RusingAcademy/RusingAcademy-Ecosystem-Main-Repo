import { test, expect, devices } from '@playwright/test';

/**
 * Mobile Responsiveness Tests
 * 
 * Validates that critical pages render correctly on mobile devices.
 * Tests viewport sizes for iPhone, iPad, and common Android devices.
 */

test.describe('Mobile Responsiveness', () => {
  
  const mobileViewports = [
    { name: 'iPhone 13', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Galaxy S21', width: 360, height: 800 },
  ];
  
  const criticalPages = ['/', '/courses', '/pricing', '/login', '/about'];
  
  for (const viewport of mobileViewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      
      test.use({ viewport: { width: viewport.width, height: viewport.height } });
      
      for (const path of criticalPages) {
        test(`${path} renders without horizontal overflow`, async ({ page }) => {
          await page.goto(path);
          await page.waitForLoadState('networkidle');
          
          // Check for horizontal overflow
          const hasOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          
          // Allow small overflow (up to 5px for scrollbar)
          const overflowAmount = await page.evaluate(() => {
            return document.documentElement.scrollWidth - document.documentElement.clientWidth;
          });
          
          expect(overflowAmount).toBeLessThanOrEqual(5);
        });
      }
      
      test('header is visible on mobile', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const header = page.locator('header').first();
        await expect(header).toBeVisible();
      });
      
      test('no content duplication on mobile', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Check that h1 elements are not duplicated
        const h1Count = await page.locator('h1:visible').count();
        expect(h1Count).toBeLessThanOrEqual(2); // Allow max 2 visible h1s
      });
    });
  }
});
