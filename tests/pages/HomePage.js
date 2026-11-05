class HomePage {
  constructor(page) {
    this.page = page;
    this.navHome = page.locator('[data-testid="nav-home"]');
    this.navProjects = page.locator('[data-testid="nav-projects"]');
    this.navAbout = page.locator('[data-testid="nav-about"]');
    this.langEn = page.locator('[data-testid="lang-en"]');
    this.langRu = page.locator('[data-testid="lang-ru"]');
  }

  async goto() {
    await this.page.goto('/index.html');
  }

  async clickProjects() {
    await this.navProjects.click();
  }

  async clickAbout() {
    await this.navAbout.click();
  }

  async switchToRu() {
    await this.langRu.click();
  }
}

module.exports = { HomePage };