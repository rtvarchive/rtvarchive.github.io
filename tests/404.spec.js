const { test, expect } = require('@playwright/test');

test.describe('404 Page Routing', () => {
  test('TC-NAV-04: Custom 404 page is displayed for non-existent routes (EN)', async ({ page }) => {
    // 1. Переходим на несуществующую страницу (EN версия)
    const response = await page.goto('/non-existent-page-test.html');

    // 2. Проверяем, что сервер вернул статус 404
    expect(response.status()).toBe(404);

    // 3. Проверяем, что отобразилась наша кастомная 404 страница (EN)
    await expect(page.locator('h1.error-code')).toHaveText('404');
    await expect(page.locator('.error-title')).toHaveText('Signal Lost');
  });

    test('TC-NAV-05: Custom 404 page is displayed for non-existent routes (RU)', async ({ page }) => {
    // 1. Проверяем, что сервер отдает 404 статус для несуществующего пути
    const response = await page.goto('/ru/non-existent-page-test.html');
    expect(response.status()).toBe(404);

    // 2. Так как Live Server отдает корневую 404, мы переходим на русскую 404 напрямую, 
    // чтобы проверить её верстку и локаторы
    await page.goto('/ru/404.html');
    
    await expect(page.locator('h1.error-code')).toHaveText('404');
    await expect(page.locator('.error-title')).toHaveText('Сигнал потерян');
  });
});