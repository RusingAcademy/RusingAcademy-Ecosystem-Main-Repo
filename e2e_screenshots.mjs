import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';

const BASE = 'http://localhost:3000';
const OUT = '/home/ubuntu/coach_onboarding_e2e';

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  // ── DESKTOP SCREENSHOTS ──
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. /become-a-coach landing
  console.log('📸 1. become-a-coach landing (hero)');
  await page.goto(`${BASE}/become-a-coach`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_01_become_coach_hero.png`, fullPage: false });

  // Scroll down to see more
  await page.evaluate(() => window.scrollTo(0, 800));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUT}/e2e_02_become_coach_benefits.png`, fullPage: false });

  // Scroll to bottom CTA
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: `${OUT}/e2e_03_become_coach_bottom_cta.png`, fullPage: false });

  // 2. Coach Terms - FR
  console.log('📸 2. coach terms FR');
  await page.goto(`${BASE}/coach/terms`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_04_coach_terms_fr.png`, fullPage: false });

  // Toggle to EN
  console.log('📸 3. coach terms EN toggle');
  try {
    const toggleBtn = await page.$('button:has(svg)');
    if (toggleBtn) {
      await toggleBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  } catch (e) { console.log('Toggle button not found, trying text-based'); }
  await page.screenshot({ path: `${OUT}/e2e_05_coach_terms_en.png`, fullPage: false });

  // Scroll down to see more content
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${OUT}/e2e_06_coach_terms_content.png`, fullPage: false });

  // 3. /coaches listing
  console.log('📸 4. coaches listing');
  await page.goto(`${BASE}/coaches`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_07_coaches_listing.png`, fullPage: false });

  // Scroll to see more coaches
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${OUT}/e2e_08_coaches_listing_scroll.png`, fullPage: false });

  // 4. Coach Guide
  console.log('📸 5. coach guide');
  await page.goto(`${BASE}/coach/guide`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_09_coach_guide.png`, fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${OUT}/e2e_10_coach_guide_content.png`, fullPage: false });

  // 5. Admin panel - Coaches Management
  console.log('📸 6. admin coaches management');
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_11_admin_panel.png`, fullPage: false });

  // 6. Admin coach applications
  console.log('📸 7. admin coach applications');
  await page.goto(`${BASE}/admin/applications`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_12_admin_applications.png`, fullPage: false });

  // 7. Coach Dashboard (if accessible)
  console.log('📸 8. coach dashboard');
  await page.goto(`${BASE}/coach/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_13_coach_dashboard.png`, fullPage: false });

  // 8. Coach Availability
  console.log('📸 9. coach availability');
  await page.goto(`${BASE}/app/availability`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_14_coach_availability.png`, fullPage: false });

  // 9. Coach Profile Editor
  console.log('📸 10. coach profile editor');
  await page.goto(`${BASE}/app/coach-profile`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_15_coach_profile_editor.png`, fullPage: false });

  // 10. Coach Earnings
  console.log('📸 11. coach earnings');
  await page.goto(`${BASE}/coach/earnings`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_16_coach_earnings.png`, fullPage: false });

  // 11. Coach Payments
  console.log('📸 12. coach payments');
  await page.goto(`${BASE}/coach/payments`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.screenshot({ path: `${OUT}/e2e_17_coach_payments.png`, fullPage: false });

  // ── MOBILE SCREENSHOTS ──
  console.log('\n📱 MOBILE SCREENSHOTS');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  // Mobile: become-a-coach
  console.log('📸 M1. mobile become-a-coach');
  await mobilePage.goto(`${BASE}/become-a-coach`, { waitUntil: 'networkidle2', timeout: 30000 });
  await mobilePage.screenshot({ path: `${OUT}/mobile_01_become_coach_hero.png`, fullPage: false });

  await mobilePage.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 500));
  await mobilePage.screenshot({ path: `${OUT}/mobile_02_become_coach_scroll.png`, fullPage: false });

  await mobilePage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 500));
  await mobilePage.screenshot({ path: `${OUT}/mobile_03_become_coach_bottom.png`, fullPage: false });

  // Mobile: coach terms
  console.log('📸 M2. mobile coach terms');
  await mobilePage.goto(`${BASE}/coach/terms`, { waitUntil: 'networkidle2', timeout: 30000 });
  await mobilePage.screenshot({ path: `${OUT}/mobile_04_coach_terms.png`, fullPage: false });

  await mobilePage.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 500));
  await mobilePage.screenshot({ path: `${OUT}/mobile_05_coach_terms_scroll.png`, fullPage: false });

  // Mobile: coaches listing
  console.log('📸 M3. mobile coaches listing');
  await mobilePage.goto(`${BASE}/coaches`, { waitUntil: 'networkidle2', timeout: 30000 });
  await mobilePage.screenshot({ path: `${OUT}/mobile_06_coaches_listing.png`, fullPage: false });

  await mobilePage.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 500));
  await mobilePage.screenshot({ path: `${OUT}/mobile_07_coaches_listing_scroll.png`, fullPage: false });

  // Mobile: coach guide
  console.log('📸 M4. mobile coach guide');
  await mobilePage.goto(`${BASE}/coach/guide`, { waitUntil: 'networkidle2', timeout: 30000 });
  await mobilePage.screenshot({ path: `${OUT}/mobile_08_coach_guide.png`, fullPage: false });

  // Mobile: coach dashboard
  console.log('📸 M5. mobile coach dashboard');
  await mobilePage.goto(`${BASE}/coach/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 });
  await mobilePage.screenshot({ path: `${OUT}/mobile_09_coach_dashboard.png`, fullPage: false });

  // Mobile: availability
  console.log('📸 M6. mobile availability');
  await mobilePage.goto(`${BASE}/app/availability`, { waitUntil: 'networkidle2', timeout: 30000 });
  await mobilePage.screenshot({ path: `${OUT}/mobile_10_availability.png`, fullPage: false });

  // Mobile: coach profile editor
  console.log('📸 M7. mobile coach profile editor');
  await mobilePage.goto(`${BASE}/app/coach-profile`, { waitUntil: 'networkidle2', timeout: 30000 });
  await mobilePage.screenshot({ path: `${OUT}/mobile_11_profile_editor.png`, fullPage: false });

  // Mobile: coach earnings
  console.log('📸 M8. mobile coach earnings');
  await mobilePage.goto(`${BASE}/coach/earnings`, { waitUntil: 'networkidle2', timeout: 30000 });
  await mobilePage.screenshot({ path: `${OUT}/mobile_12_earnings.png`, fullPage: false });

  await browser.close();
  console.log(`\n✅ Done! ${17 + 12} screenshots saved to ${OUT}/`);
}

main().catch(e => { console.error(e); process.exit(1); });
