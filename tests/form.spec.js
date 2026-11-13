const { test, expect } = require('@playwright/test');
const { AboutPage } = require('./pages/AboutPage');

test.describe('About Page - Form & Popup', () => {
  let aboutPage;

  test.beforeEach(async ({ page }) => {
    aboutPage = new AboutPage(page);
    await aboutPage.goto();
  });

  test('TC-ABT-01: Form validation blocks empty submission', async () => {
    await aboutPage.submitForm();
    await expect(aboutPage.popup).not.toBeVisible();
    const validationMessage = await aboutPage.linkInput.evaluate((el) => el.validationMessage);
    expect(validationMessage).not.toBe('');
  });

  test('TC-ABT-03, TC-ABT-05: Successful submission and close popup via Escape', async ({ page }) => {
    // Мокаем Formspark
    await page.route('https://submit-form.com/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    await aboutPage.fillForm('https://test.com', 'Test description');
    await aboutPage.submitForm();
    
    // Проверяем модалку
    await expect(aboutPage.popup).toHaveClass(/is-active/);
    
    // Проверяем закрытие через Escape
    await page.keyboard.press('Escape');
    await expect(aboutPage.popup).not.toHaveClass(/is-active/);
  });
  
  test('TC-ABT-07: Signal Room link exists', async () => {
    await expect(aboutPage.signalRoomLink).toBeVisible();
  });
});