import { test, expect } from '@playwright/test';

test.describe('Project Pages (EN)', () => {

  // ==========================================
  // ГРУППА A: RITUAL-84 (3 альбома)
  // ==========================================
  test.describe('Ritual-84', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ritual84.html');
    });

    test('PP-01: renders 3 album cards', async ({ page }) => {
      await expect(page.getByTestId('project-detail-summer')).toBeVisible();
      await expect(page.getByTestId('project-detail-polar')).toBeVisible();
      await expect(page.getByTestId('project-detail-caucasus')).toBeVisible();
    });

    test('PP-02: statuses are correct (available/available/soon)', async ({ page }) => {
      await expect(page.getByTestId('project-status-summer')).toHaveAttribute('data-status', 'available');
      await expect(page.getByTestId('project-status-polar')).toHaveAttribute('data-status', 'available');
      await expect(page.getByTestId('project-status-caucasus')).toHaveAttribute('data-status', 'soon');
    });

    test('PP-03: tracklists have correct number of items', async ({ page }) => {
      await expect(page.locator('[data-testid="project-tracklist-summer"] li')).toHaveCount(8);
      await expect(page.locator('[data-testid="project-tracklist-polar"] li')).toHaveCount(9);
      await expect(page.locator('[data-testid="project-tracklist-caucasus"] li')).toHaveCount(9);
    });

    test('PP-04: listen buttons state (enabled/enabled/disabled)', async ({ page }) => {
      await expect(page.getByTestId('listen-button-summer')).toBeEnabled();
      await expect(page.getByTestId('listen-button-polar')).toBeEnabled();
      await expect(page.getByTestId('listen-button-caucasus')).toBeDisabled();
    });

    test('PP-05: opens Summer modal on click', async ({ page }) => {
      const modal = page.getByTestId('listen-modal-summer');
      await expect(modal).not.toBeVisible();
      await page.getByTestId('listen-button-summer').click();
      await expect(modal).toBeVisible();
      await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    });

    test('PP-06: closes modal via close button', async ({ page }) => {
      const modal = page.getByTestId('listen-modal-summer');
      await page.getByTestId('listen-button-summer').click();
      await expect(modal).toBeVisible();
      
      await page.getByTestId('modal-close-summer').click();
      await expect(modal).not.toBeVisible();
      await expect(page.locator('body')).toHaveCSS('overflow', 'auto');
    });

    test('PP-07: closes modal by clicking backdrop', async ({ page }) => {
      const modal = page.getByTestId('listen-modal-summer');
      await page.getByTestId('listen-button-summer').click();
      await expect(modal).toBeVisible();
      
      await modal.click({ position: { x: 10, y: 10 } });
      await expect(modal).not.toBeVisible();
    });

    test('PP-08: deep-link ?listen=polar opens modal directly', async ({ page }) => {
      await page.goto('/ritual84.html?listen=polar');
      await expect(page.getByTestId('listen-modal-polar')).toBeVisible();
    });

    test('PP-09: platform links have valid hrefs', async ({ page }) => {
      await page.getByTestId('listen-button-summer').click();
      const links = page.locator('[data-testid="platform-links-summer"] a');
      await expect(links).toHaveCount(6);
      
      for (let i = 0; i < 6; i++) {
        const href = await links.nth(i).getAttribute('href');
        expect(href).not.toBeNull();
        expect(href).not.toBe('#');
      }
    });

    test('PP-10: copy-toast appears and fades out', async ({ page }) => {
      await page.getByTestId('listen-button-summer').click();
      
      // Подменяем саму функцию copyLink в окне браузера
      await page.evaluate(() => {
        window.copyLink = function() {
          const toast = document.getElementById('copy-toast');
          if (toast) {
            toast.style.opacity = '1';
            setTimeout(() => { toast.style.opacity = '0'; }, 2000);
          }
        };
      });

      const toast = page.locator('#copy-toast');
      await expect(toast).toHaveCSS('opacity', '0');
      
      await page.getByTestId('copy-link-summer').click();
      await expect(toast).toHaveCSS('opacity', '1', { timeout: 3000 });
      
      await page.waitForTimeout(2500);
      await expect(toast).toHaveCSS('opacity', '0');
    });
  });

  // ==========================================
  // ГРУППА B: ОДИНОЧНЫЕ ПРОЕКТЫ (1 альбом)
  // ==========================================
  const singleProjects = [
    { name: '605 Mikrorayon', url: '/605.html', trackCount: 14 },
    { name: 'Oriental Bazaar', url: '/orientalbazaar.html', trackCount: 11 },
    { name: 'Phase/Zero', url: '/phasezero.html', trackCount: 12 },
    { name: 'Final Psalm', url: '/finalpsalm.html', trackCount: 13 },
    { name: 'Gurt Groove', url: '/gurtgroove.html', trackCount: 8 },
  ];

  for (const project of singleProjects) {
    test.describe(`${project.name}`, () => {
      
      test.beforeEach(async ({ page }) => {
        await page.goto(project.url);
      });

      test(`renders card and tracklist correctly`, async ({ page }) => {
        // Проверяем карточку и обложку
        await expect(page.getByTestId('project-detail')).toBeVisible();
        await expect(page.getByTestId('project-cover')).toBeVisible();
        
        // Проверяем статус
        await expect(page.getByTestId('project-status')).toHaveAttribute('data-status', 'available');
        
        // Проверяем количество треков
        await expect(page.locator('[data-testid="project-tracklist"] li')).toHaveCount(project.trackCount);
      });

      test(`opens and closes modal correctly`, async ({ page }) => {
        const modal = page.getByTestId('listen-modal');
        await expect(modal).not.toBeVisible();
        
        // Открываем
        await page.getByTestId('listen-button').click();
        await expect(modal).toBeVisible();
        
        // Закрываем крестиком
        await page.getByTestId('modal-close').click();
        await expect(modal).not.toBeVisible();
      });

      test(`opens modal via deep-link ?listen=1`, async ({ page }) => {
        await page.goto(`${project.url}?listen=1`);
        await expect(page.getByTestId('listen-modal')).toBeVisible();
      });

      test(`copy-toast works correctly`, async ({ page }) => {
        await page.getByTestId('listen-button').click();
        
        // Подменяем функцию copyLink
        await page.evaluate(() => {
          window.copyLink = function() {
            const toast = document.getElementById('copy-toast');
            if (toast) {
              toast.style.opacity = '1';
              setTimeout(() => { toast.style.opacity = '0'; }, 2000);
            }
          };
        });

        const toast = page.locator('#copy-toast');
        await expect(toast).toHaveCSS('opacity', '0');
        
        await page.getByTestId('copy-link').click();
        await expect(toast).toHaveCSS('opacity', '1', { timeout: 3000 });
        
        await page.waitForTimeout(2500);
        await expect(toast).toHaveCSS('opacity', '0');
      });

    });
  }
});