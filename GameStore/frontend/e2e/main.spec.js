import { test, expect } from '@playwright/test';

test.describe('🎮 Vault Game Store e2e Testing', () => {

    test('Home Page renders correctly', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/PlayVault/i);
        // Validate Hero banner exist
        const heroBtn = page.getByRole('link', { name: /ENTER VAULT/i });
        await expect(heroBtn).toBeVisible();
    });

    test('Public Browse Catalog loads products', async ({ page }) => {
        await page.goto('/browse');
        await expect(page.locator('h1')).toContainText('Complete');
        // Ensure search filter input is visible
        await expect(page.getByPlaceholder('Search games...')).toBeVisible();
    });

    test('Authentication Flow - Register & Login Validations', async ({ page }) => {
        await page.goto('/login');
        // Expect login inputs
        await expect(page.getByPlaceholder('agent@playvault.gg')).toBeVisible();

        // Test navigation to signup
        await page.getByRole('link', { name: /REGISTER NOW/i }).click();
        await expect(page).toHaveURL(/.*register/);
        await expect(page.getByPlaceholder('Agent Name')).toBeVisible();
    });

    test('Navbar checks & Mobile responsive', async ({ page }) => {
        await page.goto('/');
        const links = ['Home', 'Catalog', 'FAQ', 'Intel'];
        for (const link of links) {
            await expect(page.locator(`nav >> text=${link}`)).toBeVisible();
        }
    });

    test('Admin Override Gateway renders and restricts', async ({ page }) => {
        await page.goto('/admin/login');
        await expect(page.locator('h2')).toContainText('OVERRIDE');
        // Attempt bad login
        await page.getByPlaceholder('SYS_ADMIN_ID').fill('ghost@playvault.gg');
        await page.getByPlaceholder('ACCESS_CODE').fill('wrongpassword');
        await page.getByRole('button', { name: /INITIALIZE LOGIN/i }).click();

        // Expect error toast inside the DOM
        await expect(page.locator('.text-sm', { hasText: 'Invalid Admin Credentials' })).toBeVisible({ timeout: 10000 });
    });

});
