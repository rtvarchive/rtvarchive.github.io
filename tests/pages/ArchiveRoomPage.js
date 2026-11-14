const { expect } = require('@playwright/test'); // <--- Добавили expect, чтобы не было ошибки

class ArchiveRoomPage {
  constructor(page) {
    this.page = page;

    // --- ВЕРХНИЙ ПЛЕЕР (КИНЕСКОП) ---
    this.archiveSearch = page.locator('#archive-search');
    this.cardList = page.locator('#card-list');
    this.folderHeader = page.locator('.card-folder .folder-header'); // <--- Уточнили селектор
    this.trackItem = page.locator('.track-item');
    this.currentChannel = page.locator('#current-channel');
    this.archiveLog = page.locator('#archive-log');
    this.screenWrapper = page.locator('#screen-wrapper');
    this.playBtn = page.locator('#play-btn');
    this.nextBtn = page.locator('#next-btn');
    this.prevBtn = page.locator('#prev-btn');

    // --- НИЖНИЙ ПЛЕЕР (БОБИНЫ / TAPE MONITOR) ---
    this.releasesSearch = page.locator('#releases-search');
    this.reelList = page.locator('#reel-list');
    this.albumItem = page.locator('.album-item');
    this.reelInfo = page.locator('#reel-info');
    this.streamingPlayer = page.locator('#streaming-youtube-player');
    this.reelPlayBtn = page.locator('#reel-play-btn');
    this.reelPauseBtn = page.locator('#reel-pause-btn');
    this.reelStopBtn = page.locator('#reel-stop-btn');
    this.reelWheel1 = page.locator('#reel-wheel-1');
    this.reelWheel2 = page.locator('#reel-wheel-2');
  }

  async goto() {
    await this.page.goto('/archive-room-en.html');
    // Ждем появления первой папки
    await this.folderHeader.first().waitFor({ state: 'visible' });
  }

  // --- МЕТОДЫ ДЛЯ ВЕРХНЕГО ПЛЕЕРА ---

  async openFolder(folderName) {
    // Ищем папку по тексту и берем ПЕРВЫЙ элемент (чтобы не кликнуть дважды)
    const folder = this.page.locator('.card-folder', { hasText: folderName }).first();
    await folder.locator('.folder-header').click();
    
    // Ждем, пока папка получит класс is-open (значит, она раскрылась)
    await expect(folder).toHaveClass(/is-open/, { timeout: 2000 });
  }

  async clickTrack(trackName) {
    const track = this.page.locator('.track-item', { hasText: trackName }).first();
    await track.click();
  }

  async searchCatalog(query) {
    await this.archiveSearch.fill(query);
  }

  // --- МЕТОДЫ ДЛЯ НИЖНЕГО ПЛЕЕРА ---

  async openReelFolder(folderName) {
    const folder = this.page.locator('#reel-list .card-folder', { hasText: folderName }).first();
    await folder.locator('.folder-header').click();
    
    await expect(folder).toHaveClass(/is-open/, { timeout: 2000 });
  }

  async clickAlbum(albumName) {
    const album = this.page.locator('#reel-list .album-item', { hasText: albumName }).first();
    await album.click();
  }

  async searchReleases(query) {
    await this.releasesSearch.fill(query);
  }
}

module.exports = { ArchiveRoomPage };