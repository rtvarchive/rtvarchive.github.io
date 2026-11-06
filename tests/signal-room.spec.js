const { test, expect } = require('@playwright/test');
const { SignalRoomPage } = require('./pages/SignalRoomPage');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Signal Room - Functionality & A11y', () => {
  let signalPage;

  test.beforeEach(async ({ page }) => {
    signalPage = new SignalRoomPage(page);
    await signalPage.goto();
  });

    test('TC-SIG-01: Request Latest Report updates UI', async ({ page }) => {
    // Запоминаем текущую дату (она подтянется из JSON при загрузке)
    const initialDate = await signalPage.lastCheckDate.textContent();
    
    // Нажимаем кнопку
    await signalPage.clickRequestReport();
    
    // Проверяем, что текст кнопки изменился на "Requesting..." или "Report Received"
    await expect(signalPage.btnStartCheck).toHaveText(/Requesting|Report Received/);
    
    // Ждем, пока кнопка вернется в исходное состояние
    await expect(signalPage.btnStartCheck).toHaveText('Request Latest Report', { timeout: 5000 });

    // Проверяем, что дата все еще отображается (но не обязательно изменилась)
    const newDate = await signalPage.lastCheckDate.textContent();
    expect(newDate).toBeTruthy(); // Просто проверяем, что там что-то есть
  });

      test('TC-SIG-02: Report Interference form submission', async ({ page }) => {
    // Заполняем форму
    await signalPage.fillReportForm('signal-room-en.html', 'Test interference description');
    
    // Нажимаем "File Report"
    await signalPage.submitReport();
    
    // Ждем, пока появится модальное окно (попап)
    const popup = page.locator('[data-testid="submission-popup"]');
    await expect(popup).toHaveClass(/is-active/, { timeout: 5000 });
    
    // Проверяем, что форма скрылась
    await expect(signalPage.reportForm).toBeHidden();
  });

  test('TC-SIG-03: A11y scan for Signal Room', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});