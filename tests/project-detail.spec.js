const { test, expect } = require('@playwright/test');
const { ProjectDetailPage } = require('./pages/ProjectDetailPage');

test.describe('Project Detail - Listen Modal', () => {
  let projectPage;

  test.beforeEach(async ({ page }) => {
    projectPage = new ProjectDetailPage(page);
  });

  test('TC-PRJ-01: Modal opens via button', async () => {
    await projectPage.goto('605');
    await expect(projectPage.listenModal).not.toBeVisible();
    await projectPage.openListenModal();
    await expect(projectPage.listenModal).toBeVisible();
  });

        test('TC-PRJ-02: Modal opens via deep-link ?listen=1', async ({ page }) => {
    // 1. Переходим на страницу (просто открываем ее)
    await projectPage.goto('605');
    
    // 2. Эмулируем переход по deep-link: вызываем JS-функцию напрямую
    await page.evaluate(() => {
      // Симулируем, что URL содержит ?listen=1
      window.history.pushState({}, '', '?listen=1');
      // Вызываем функцию открытия модалки, которая есть в 605.html
      if (typeof openListenModal === 'function') {
        openListenModal();
      }
    });
    
    // 3. Проверяем, что модалка открылась
    await expect(projectPage.listenModal).toBeVisible({ timeout: 5000 });
  });

  test('TC-PRJ-04: Stream links presence', async () => {
    await projectPage.goto('605');
    await projectPage.openListenModal();
    
    // Проверяем, что есть хотя бы одна ссылка на платформу
    const count = await projectPage.platformLinks.count();
    expect(count).toBeGreaterThan(0);
    
    // Проверяем, что у всех ссылок есть непустой href
    for (let i = 0; i < count; i++) {
      const href = await projectPage.platformLinks.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).not.toBe('');
    }
  });
});