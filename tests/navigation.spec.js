const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/HomePage');

test.describe('Global Navigation & Language', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('TC-NAV-01: Header links navigation', async ({ page }) => {
    await homePage.clickProjects();
    await expect(page).toHaveURL(/.*projects(\.html)?$/);
    await expect(homePage.navProjects).toHaveAttribute('aria-current', 'page');
    await homePage.clickAbout();
    await expect(page).toHaveURL(/.*about(\.html)?$/);
    await expect(homePage.navAbout).toHaveAttribute('aria-current', 'page');
  });

  test('TC-NAV-02: Language switcher (EN to RU)', async ({ page }) => {
    await homePage.switchToRu();
    await expect(page).toHaveURL(/.*\/ru(\/(index\.html)?)?$/);
    await expect(homePage.langRu).toHaveClass(/is-active/);
  });

  test('TC-NAV-03: Mobile menu toggle and navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/ru/index.html');
    const menuToggle = page.locator('[data-testid="menu-toggle"]');
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
    const projectsLink = page.locator('[data-testid="nav-projects"]');
    await expect(projectsLink).toBeVisible(); 
    await projectsLink.click();
    await expect(page).toHaveURL(/.*projects\.html/);
  });
});