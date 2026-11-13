class SignalRoomPage {
  constructor(page) {
    this.page = page;
    // Элементы табло
    this.dashboard = page.locator('[data-testid="signal-dashboard"]');
    this.btnStartCheck = page.locator('[data-testid="btn-start-check"]');
    this.lastCheckDate = page.locator('[data-testid="last-check-date"]');
    
    // Элементы формы
    this.reportForm = page.locator('#report-form');
    this.inputFreq = page.locator('#freq');
    this.inputDesc = page.locator('#desc');
    this.btnSubmitReport = page.locator('[data-testid="btn-submit-report"]');
    
    // Модалка
    this.modal = page.locator('[data-testid="submission-popup"]');
    this.closeModalBtn = page.locator('[data-testid="popup-close"]');
  }

  async goto() {
    await this.page.goto('/signal-room-en.html');
  }

  async clickRequestReport() {
    await this.btnStartCheck.click();
  }

  async fillReportForm(freq, desc) {
    await this.inputFreq.fill(freq);
    await this.inputDesc.fill(desc);
  }

  async submitReport() {
    await this.btnSubmitReport.click();
  }
}

module.exports = { SignalRoomPage };