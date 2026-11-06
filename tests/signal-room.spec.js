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
    const initialDate = await signalPage.lastCheckDate.textContent();
    await signalPage.clickRequestReport();
    await expect(signalPage.btnStartCheck).toHaveText(/Requesting|Report Received/);
    await expect(signalPage.btnStartCheck).toHaveText('Request Latest Report', { timeout: 5000 });
    const newDate = await signalPage.lastCheckDate.textContent();
    expect(newDate).toBeTruthy();
  });

  test('TC-SIG-02: Report Interference form submission', async ({ page }) => {
    await signalPage.fillReportForm('signal-room-en.html', 'Test interference description');
    await signalPage.submitReport();
    const popup = page.locator('[data-testid="submission-popup"]');
    await expect(popup).toHaveClass(/is-active/, { timeout: 5000 });
    await expect(signalPage.reportForm).toBeHidden();
  });

  test('TC-SIG-03: A11y scan for Signal Room', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});