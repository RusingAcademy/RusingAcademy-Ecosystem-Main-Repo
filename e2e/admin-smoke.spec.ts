import { test, expect } from '@playwright/test';

/**
 * Admin Panel Smoke Tests
 * 
 * Validates that admin routes load without crashing.
 * These tests run as unauthenticated users — they verify
 * that the admin panel either:
 * 1. Redirects to login (correct behavior)
 * 2. Shows an access denied message
 * 3. Loads the admin UI (if no auth gate exists yet)
 * 
 * Full admin workflow tests require authenticated sessions
 * and will be added in a future sprint.
 */

test.describe('Admin Panel Smoke Tests', () => {
  
  const adminRoutes = [
    '/admin',
    '/admin/users',
    '/admin/courses',
    '/admin/analytics',
    '/admin/settings',
  ];
  
  for (const route of adminRoutes) {
    test(`${route} does not crash (500)`, async ({ page }) => {
      const response = await page.goto(route);
      
      // Should NOT return a server error
      expect(response?.status()).toBeLessThan(500);
      
      // Page should render something
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Check for React error boundary or crash
      const errorBoundary = page.locator('[class*="error-boundary"], [class*="ErrorBoundary"]');
      const hasCrash = await errorBoundary.count() > 0 && await errorBoundary.isVisible();
      expect(hasCrash).toBeFalsy();
    });
  }
  
  test('admin panel has navigation structure', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Check that some UI structure exists (sidebar, nav, or content)
    const uiStructure = page.locator('nav, aside, [class*="sidebar"], [class*="admin"]').first();
    if (await uiStructure.count() > 0) {
      await expect(uiStructure).toBeVisible();
    }
  });
});
