class ProjectDetailPage {
  constructor(page) {
    this.page = page;
    this.listenBtn = page.locator('[data-testid="listen-button"]');
    this.listenModal = page.locator('[data-testid="listen-modal"]');
    this.closeModalBtn = page.locator('[data-testid="modal-close"]');
    this.platformLinks = page.locator('[data-testid="platform-links"] a');
  }

  async goto(projectSlug, query = '') {
    await this.page.goto(`/${projectSlug}.html${query}`);
  }

  async openListenModal() {
    await this.listenBtn.click();
  }

  async closeListenModal() {
    await this.closeModalBtn.click();
  }
}

module.exports = { ProjectDetailPage };