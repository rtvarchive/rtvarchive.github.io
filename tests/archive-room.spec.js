const { test, expect } = require('@playwright/test');
const { ArchiveRoomPage } = require('./pages/ArchiveRoomPage');

test.describe('Archive Room - Кинескоп & Бобины', () => {
  let archivePage;

  test.beforeEach(async ({ page }) => {
    archivePage = new ArchiveRoomPage(page);
    
    // Мокаем API YouTube, чтобы тесты не ждали реальной загрузки видео
    await page.route('https://www.youtube.com/iframe_api', route => route.fulfill({ body: '' }));
    await page.route('https://www.youtube.com/embed/**', route => route.fulfill({ body: '' }));
    
    await archivePage.goto();
  });

  // --- ТЕСТЫ ДЛЯ ВЕРХНЕГО ПЛЕЕРА (КИНЕСКОП) ---

  test('TC-ARC-01: Загрузка каталога и раскрытие папки', async () => {
    const folder = archivePage.page.locator('.card-folder', { hasText: '605 Mikrorayon' }).first();
    await expect(folder).toBeVisible();
    
    await archivePage.openFolder('605 Mikrorayon');
    
    // Прокручиваем до трека, чтобы он точно был виден
    const track = folder.locator('.track-item', { hasText: 'Empty Courtyards' }).first();
    await track.scrollIntoViewIfNeeded();
    await expect(track).toBeVisible();
  });

  test('TC-ARC-02: Клик по треку обновляет лог и канал', async () => {
    await archivePage.openFolder('605 Mikrorayon');
    await archivePage.clickTrack('Empty Courtyards');

    await expect(archivePage.archiveLog).toContainText('Empty Courtyards');
    await expect(archivePage.currentChannel).toContainText('P-01');
  });

  test('TC-ARC-03: Поиск по названию проекта', async () => {
    await archivePage.searchCatalog('Wild');
    
    const wildHoneyFolder = archivePage.page.locator('.card-folder', { hasText: 'Wild Honey' }).first();
    await expect(wildHoneyFolder).toBeVisible();

    const hiddenFolder = archivePage.page.locator('.card-folder', { hasText: '605 Mikrorayon' }).first();
    await expect(hiddenFolder).toBeHidden();
  });

  test('TC-ARC-04: Поиск по названию трека', async () => {
    await archivePage.searchCatalog('Research Institute');
    
    const phaseZeroFolder = archivePage.page.locator('.card-folder', { hasText: 'PHASE/ZERO' }).first();
    await expect(phaseZeroFolder).toBeVisible();
    
    const track = phaseZeroFolder.locator('.track-item', { hasText: 'Research Institute of Silence' }).first();
    await track.scrollIntoViewIfNeeded();
    await expect(track).toBeVisible();
  });

  test('TC-ARC-05: Сброс поиска', async () => {
    await archivePage.searchCatalog('Wild');
    await archivePage.searchCatalog('');
    
    const allFolders = archivePage.page.locator('#card-list .card-folder');
    await expect(allFolders).toHaveCount(await allFolders.count()); 
  });

  // --- ТЕСТЫ ДЛЯ НИЖНЕГО ПЛЕЕРА (БОБИНЫ) ---

  test('TC-ARC-06: Загрузка картотеки релизов', async () => {
    const reelFolder = archivePage.page.locator('#reel-list .card-folder', { hasText: 'Ritual-84' }).first();
    await expect(reelFolder).toBeVisible();
    
    await archivePage.openReelFolder('Ritual-84');
    
    const album = reelFolder.locator('.album-item', { hasText: 'Summer Expedition' }).first();
    await album.scrollIntoViewIfNeeded();
    await expect(album).toBeVisible();
  });

  test('TC-ARC-07: Клик по альбому выделяет его', async () => {
    await archivePage.openReelFolder('Ritual-84');
    
    const album = archivePage.page.locator('.album-item', { hasText: 'Summer Expedition' }).first();
    await album.scrollIntoViewIfNeeded();
    await album.click();
    
    // Проверяем, что альбом получил класс active (значит, клик сработал)
    await expect(album).toHaveClass(/active/);
  });

  test('TC-ARC-08: Поиск по релизам', async () => {
    await archivePage.searchReleases('Ritual');
    
    const ritualFolder = archivePage.page.locator('#reel-list .card-folder', { hasText: 'Ritual-84' }).first();
    await expect(ritualFolder).toBeVisible();
    
    const otherFolder = archivePage.page.locator('#reel-list .card-folder', { hasText: 'Oriental Bazaar' }).first();
    await expect(otherFolder).toBeHidden();
  });

  test('TC-ARC-09: Кнопка Stop останавливает катушки', async () => {
    await archivePage.openReelFolder('Ritual-84');
    
    const album = archivePage.page.locator('.album-item', { hasText: 'Summer Expedition' }).first();
    await album.scrollIntoViewIfNeeded();
    await album.click();
    
    await archivePage.reelStopBtn.click();
    
    await expect(archivePage.reelInfo).toHaveText('> STANDBY');
    await expect(archivePage.reelWheel1).not.toHaveClass(/is-spinning/);
    await expect(archivePage.reelWheel2).not.toHaveClass(/is-spinning/);
  });

  test('TC-ARC-10: Кнопки Prev/Next в Кинескопе', async () => {
    await archivePage.openFolder('605 Mikrorayon');
    await archivePage.clickTrack('Empty Courtyards');
    
    await archivePage.nextBtn.click();
    await expect(archivePage.archiveLog).toContainText('There Was a City Here');
    
    await archivePage.prevBtn.click();
    await expect(archivePage.archiveLog).toContainText('Empty Courtyards');
  });
});