const { expect } = require('@playwright/test');

class AboutPage {
  constructor(page) {
    this.page = page;
    this.form = page.locator('[data-testid="submission-form"]');
    this.emailInput = page.locator('[data-testid="submission-email"]');
    this.linkInput = page.locator('[data-testid="submission-link"]');
    this.descInput = page.locator('[data-testid="submission-desc"]');
    this.submitBtn = page.locator('[data-testid="submission-submit"]');
    this.popup = page.locator('[data-testid="submission-popup"]');
    this.closePopupBtn = page.locator('[data-testid="popup-close"]');
    this.signalRoomLink = page.locator('[data-testid="signal-room-link"]');
  }

  async goto() {
    await this.page.goto('/about.html');
  }

  async fillForm(link, desc) {
    await this.linkInput.fill(link);
    await this.descInput.fill(desc);
  }

  async submitForm() {
    await this.submitBtn.click();
  }

  async closePopup() {
    await this.closePopupBtn.click();
  }
}

module.exports = { AboutPage };