const { test, expect } = require('@playwright/test');

test.describe('404 Page Routing', () => {
  test('TC-NAV-04: Custom 404 page is displayed for non-existent routes (EN)', async ({ page }) => {
    // 1. Переходим на несуществующую страницу
    await page.goto('/non-existent-page-test.html');

    // 2. Проверяем, что на странице отобразился нужный текст (игнорируем URL)
    await expect(page.locator('body')).toContainText(/Signal Lost|404/i);
  });

  test('TC-NAV-05: Custom 404 page is displayed for non-existent routes (RU)', async ({ page }) => {
    // 1. Переходим на несуществующую страницу
    await page.goto('/ru/non-existent-page-test.html');

    // 2. Проверяем, что на странице отобразился нужный текст (игнорируем URL)
    await expect(page.locator('body')).toContainText(/Signal Lost|Ошибка|404/i);
  });
});
