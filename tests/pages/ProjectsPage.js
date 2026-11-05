class ProjectsPage {
  constructor(page) {
    this.page = page;
    this.postPunkFilter = page.locator('[data-testid="filter-postpunk"]');
    this.allProjectsFilter = page.locator('[data-testid="filter-all"]');
    this.card605 = page.locator('[data-testid="artist-card-01"]');
    this.cardPhaseZero = page.locator('[data-testid="artist-card-02"]');
    this.status605 = page.locator('[data-testid="status-01"]');
    this.statusDimaMilan = page.locator('[data-testid="status-12"]');
  }

  async goto() {
    await this.page.goto('/projects.html');
  }

  async filterByPostPunk() {
    await this.postPunkFilter.click();
  }

  async resetFilter() {
    await this.allProjectsFilter.click();
  }
}

module.exports = { ProjectsPage };