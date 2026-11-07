# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 404.spec.js >> 404 Page Routing >> TC-NAV-05: Custom 404 page is displayed for non-existent routes (RU)
- Location: tests\404.spec.js:16:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('.error-title')
Expected: "Сигнал потерян"
Received: "Signal Lost"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" locator('.error-title') with timeout 5000ms
  - waiting for locator('.error-title')
    12 × locator resolved to <div class="error-title">Signal Lost</div>
       - unexpected value "Signal Lost"

```

```yaml
- text: Signal Lost
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('404 Page Routing', () => {
  4  |   test('TC-NAV-04: Custom 404 page is displayed for non-existent routes (EN)', async ({ page }) => {
  5  |     // 1. Переходим на несуществующую страницу (EN версия)
  6  |     const response = await page.goto('/non-existent-page-test.html');
  7  | 
  8  |     // 2. Проверяем, что сервер вернул статус 404
  9  |     expect(response.status()).toBe(404);
  10 | 
  11 |     // 3. Проверяем, что отобразилась наша кастомная 404 страница (EN)
  12 |     await expect(page.locator('h1.error-code')).toHaveText('404');
  13 |     await expect(page.locator('.error-title')).toHaveText('Signal Lost');
  14 |   });
  15 | 
  16 |   test('TC-NAV-05: Custom 404 page is displayed for non-existent routes (RU)', async ({ page }) => {
  17 |     // 1. Переходим на несуществующую страницу в папке /ru/
  18 |     const response = await page.goto('/ru/non-existent-page-test.html');
  19 | 
  20 |     // 2. Проверяем, что сервер вернул статус 404
  21 |     expect(response.status()).toBe(404);
  22 | 
  23 |     // 3. Проверяем, что отобразилась наша кастомная 404 страница (RU)
  24 |     await expect(page.locator('h1.error-code')).toHaveText('404');
> 25 |     await expect(page.locator('.error-title')).toHaveText('Сигнал потерян');
     |                                                ^ Error: expect(locator).toHaveText(expected) failed
  26 |   });
  27 | });
```