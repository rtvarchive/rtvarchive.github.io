const { test, expect } = require('@playwright/test');
const { HomePage } = require('./pages/HomePage');

test.describe('Global Navigation & Language', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('TC-NAV-01: Header links navigation', async ({ page }) => {
    // Переход на Projects
    await homePage.clickProjects();
    // Проверяем, что URL заканчивается на projects (с html или без)
    await expect(page).toHaveURL(/.*projects(\.html)?$/);
    await expect(homePage.navProjects).toHaveAttribute('aria-current', 'page');

    // Переход на About
    await homePage.clickAbout();
    await expect(page).toHaveURL(/.*about(\.html)?$/);
    await expect(homePage.navAbout).toHaveAttribute('aria-current', 'page');
  });

   test('TC-NAV-02: Language switcher (EN to RU)', async ({ page }) => {
    await homePage.switchToRu();
    // Проверяем, что URL заканчивается на /ru или /ru/index.html (слэш в конце необязателен)
    await expect(page).toHaveURL(/.*\/ru(\/(index\.html)?)?$/);
    await expect(homePage.langRu).toHaveClass(/is-active/);
  });
});