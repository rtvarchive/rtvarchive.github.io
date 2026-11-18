import { test, expect } from '@playwright/test';

test.describe('Easter Eggs', () => {

  // EG-01: Проверка консольного лога (глобально, с любой страницы)
  test('EG-01: console reveals operator dossier', async ({ page }) => {
    const logs = [];
    
    // Слушаем консоль ДО перехода на страницу, чтобы не пропустить логи
    page.on('console', msg => logs.push(msg.text()));
    
    // Переходим на главную (main.js подключен везде)
    await page.goto('/');
    
    // Ждем, пока в массиве logs появится нужная строка (максимум 2 секунды)
    await expect.poll(() => logs.join('\n')).toContain('OPERATOR ID: 7749');
    
    const allLogs = logs.join('\n');
    expect(allLogs).toContain('RADIUS ARCHIVE SYSTEM INITIALIZED');
    expect(allLogs).toContain('PERSONNEL DOSSIER LOCATED AT: https://rtvarchive.github.io/resume/');
    expect(allLogs).toContain('Welcome to the Engineering Dept.');
  });

  // EG-02: Ссылка в EN Signal Room
  test('EG-02: operator link in EN Signal Room leads to resume', async ({ page }) => {
    await page.goto('/signal-room-en.html');
    
    // Ищем ссылку по видимому тексту
    const link = page.locator('a', { hasText: /ACCESS PERSONNEL DOSSIER/i });
    
    // Проверяем, что она видима (ты говорил, она мелкая, но не скрытая)
    await expect(link).toBeVisible();
    
    // Проверяем, что ведет на ../resume/
    await expect(link).toHaveAttribute('href', '../resume/');
    
    // Кликаем и проверяем, что URL изменился на /resume/
    await link.click();
    await expect(page).toHaveURL(/\/resume\//);
  });

  // EG-03: Ссылка в RU Signal Room
  test('EG-03: operator link in RU Signal Room leads to resume', async ({ page }) => {
    await page.goto('/ru/signal-room.html');
    
    // Ищем ссылку по русскому тексту
    const link = page.locator('a', { hasText: /ОТКРЫТЬ ЛИЧНОЕ ДЕЛО/i });
    
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '../resume/');
    
    await link.click();
    await expect(page).toHaveURL(/\/resume\//);
  });
});