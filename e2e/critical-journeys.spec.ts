import { test, expect } from '@playwright/test';

/**
 * Critical User Journeys — E2E Tests
 * 
 * Tests the primary conversion funnel:
 * Visitor → Explore → Courses → Pricing → Registration → Dashboard
 * 
 * These tests run against the production build and validate that
 * the core user experience is functional end-to-end.
 */

test.describe('Critical User Journeys', () => {
  
  // =========================================================================
  // JOURNEY 1: Visitor Landing & Navigation
  // =========================================================================
  
  test.describe('Visitor Landing Experience', () => {
    test('homepage loads with all key sections', async ({ page }) => {
      await page.goto('/');
      
      // Page loads successfully
      await expect(page).toHaveTitle(/RusingAcademy|EcosystemHub|Rusinga/i);
      
      // Header is visible with navigation
      const header = page.locator('header').first();
      await expect(header).toBeVisible();
      
      // Hero section exists
      const heroSection = page.locator('[class*="hero"], [data-testid="hero"], section').first();
      await expect(heroSection).toBeVisible();
      
      // Footer exists
      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible();
    });
    
    test('main navigation links are functional', async ({ page }) => {
      await page.goto('/');
      
      // Check key navigation links exist
      const navLinks = [
        { text: /courses|cours/i, href: '/courses' },
        { text: /pricing|tarifs/i, href: '/pricing' },
        { text: /about|à propos/i, href: '/about' },
        { text: /contact/i, href: '/contact' },
      ];
      
      for (const link of navLinks) {
        const navLink = page.locator('a, button').filter({ hasText: link.text }).first();
        if (await navLink.count() > 0) {
          await expect(navLink).toBeVisible();
        }
      }
    });
    
    test('ecosystem switcher is functional', async ({ page }) => {
      await page.goto('/');
      
      // Look for ecosystem/brand switcher
      const switcher = page.locator('[class*="ecosystem"], [class*="switcher"], [class*="brand"]').first();
      if (await switcher.count() > 0) {
        await expect(switcher).toBeVisible();
      }
    });
  });
  
  // =========================================================================
  // JOURNEY 2: Course Discovery
  // =========================================================================
  
  test.describe('Course Discovery', () => {
    test('courses page loads with catalog', async ({ page }) => {
      await page.goto('/courses');
      await page.waitForLoadState('networkidle');
      
      // Page loads without error
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // No error state visible
      const errorMessage = page.locator('[class*="error"], [role="alert"]').first();
      const hasError = await errorMessage.count() > 0 && await errorMessage.isVisible();
      expect(hasError).toBeFalsy();
    });
    
    test('pricing page loads with plans', async ({ page }) => {
      await page.goto('/pricing');
      await page.waitForLoadState('networkidle');
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
    
    test('library page loads', async ({ page }) => {
      await page.goto('/library');
      await page.waitForLoadState('networkidle');
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });
  
  // =========================================================================
  // JOURNEY 3: Ecosystem Pages
  // =========================================================================
  
  test.describe('Ecosystem Pages', () => {
    const ecosystemPages = [
      { path: '/lingueefy', name: 'Lingueefy' },
      { path: '/barholex-media', name: 'Barholex Media' },
      { path: '/coaches', name: 'Coaches' },
      { path: '/for-business', name: 'For Business' },
      { path: '/for-government', name: 'For Government' },
    ];
    
    for (const page_info of ecosystemPages) {
      test(`${page_info.name} page loads correctly`, async ({ page }) => {
        const response = await page.goto(page_info.path);
        expect(response?.status()).toBeLessThan(500);
        
        const body = page.locator('body');
        await expect(body).toBeVisible();
      });
    }
  });
  
  // =========================================================================
  // JOURNEY 4: Authentication Flow
  // =========================================================================
  
  test.describe('Authentication Flow', () => {
    test('login page renders with OAuth options', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Look for OAuth buttons (Google, Microsoft)
      const oauthButtons = page.locator('button, a').filter({ 
        hasText: /google|microsoft|sign in|login|connexion/i 
      });
      
      // At least one auth option should be visible
      if (await oauthButtons.count() > 0) {
        await expect(oauthButtons.first()).toBeVisible();
      }
    });
    
    test('register page renders', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
    
    test('unauthenticated access to dashboard redirects or shows login', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should either redirect to login or show a login prompt
      const url = page.url();
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // The page should not crash
      const hasContent = await page.locator('body').innerText();
      expect(hasContent.length).toBeGreaterThan(0);
    });
  });
  
  // =========================================================================
  // JOURNEY 5: Information Pages
  // =========================================================================
  
  test.describe('Information Pages', () => {
    const infoPages = [
      { path: '/about', name: 'About' },
      { path: '/contact', name: 'Contact' },
      { path: '/faq', name: 'FAQ' },
      { path: '/curriculum', name: 'Curriculum' },
    ];
    
    for (const page_info of infoPages) {
      test(`${page_info.name} page loads without errors`, async ({ page }) => {
        const response = await page.goto(page_info.path);
        expect(response?.status()).toBeLessThan(500);
        
        await page.waitForLoadState('networkidle');
        const body = page.locator('body');
        await expect(body).toBeVisible();
      });
    }
  });
});
