const { test, expect } = require('@playwright/test');

test('Simple test', async ({ page }) => {
  expect(1).toBe(1);
});