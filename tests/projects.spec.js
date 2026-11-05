const { test, expect } = require('@playwright/test');
const { ProjectsPage } = require('./pages/ProjectsPage');

test.describe('Projects Page - Filters & Statuses', () => {
  let projectsPage;

  test.beforeEach(async ({ page }) => {
    projectsPage = new ProjectsPage(page);
    await projectsPage.goto();
  });

  test('TC-PROJ-01: Filter by Post-punk', async () => {
    await expect(projectsPage.card605).toBeVisible();
    await expect(projectsPage.cardPhaseZero).toBeVisible();
    await projectsPage.filterByPostPunk();
    await expect(projectsPage.card605).toBeVisible();
    await expect(projectsPage.cardPhaseZero).toBeHidden();
  });

  test('TC-PROJ-04: Statuses are correct', async () => {
    await expect(projectsPage.status605).toHaveText('AVAILABLE / LISTEN');
    await expect(projectsPage.status605).toHaveAttribute('data-status', 'available');
    await expect(projectsPage.statusDimaMilan).toHaveText('SOON');
    await expect(projectsPage.statusDimaMilan).toHaveAttribute('data-status', 'soon');
  });
});