const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility (A11y) Scans', () => {
  test('TC-A11Y-01: Axe-core scan (Home)', async ({ page }) => {
    await page.goto('/index.html');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Проверяем, что нет критических или серьезных нарушений
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('TC-A11Y-02: Axe-core scan (About)', async ({ page }) => {
    await page.goto('/about.html');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    // Проверяем, что нет критических или серьезных нарушений
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});