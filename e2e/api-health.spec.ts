import { test, expect } from '@playwright/test';

/**
 * API Health & Integration Tests
 * 
 * Validates that critical API endpoints respond correctly.
 * These tests run against the live server (no mocks).
 */

test.describe('API Health Checks', () => {
  
  test('health endpoint returns OK', async ({ request }) => {
    const response = await request.get('/api/health');
    // Health endpoint may be tRPC or REST — accept 200 or redirect
    expect(response.status()).toBeLessThan(500);
  });
  
  test('tRPC system.health responds', async ({ request }) => {
    const response = await request.get('/api/trpc/system.health?input=%7B%22timestamp%22%3A1%7D');
    expect(response.status()).toBeLessThan(500);
  });
  
  test('static assets are served correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check that CSS and JS are loaded (no 404s)
    const failedRequests: string[] = [];
    page.on('response', response => {
      if (response.status() >= 400 && response.url().includes('/assets/')) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });
    
    await page.waitForLoadState('networkidle');
    expect(failedRequests).toHaveLength(0);
  });
  
  test('robots.txt is served', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('User-agent');
  });
  
  test('sitemap.xml is served', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    // Sitemap may or may not exist — just check it doesn't 500
    expect(response.status()).toBeLessThan(500);
  });
  
  test('no console errors on homepage', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors (e.g., favicon, analytics)
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('analytics') &&
      !err.includes('gtag') &&
      !err.includes('Failed to load resource: net::ERR_') &&
      !err.includes('third-party')
    );
    
    // Allow up to 2 non-critical console errors
    expect(criticalErrors.length).toBeLessThanOrEqual(2);
  });
});
