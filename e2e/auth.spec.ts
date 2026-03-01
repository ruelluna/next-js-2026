import { test, expect } from "@playwright/test";

test("login page loads and shows welcome back", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("Welcome back")).toBeVisible({ timeout: 15000 });
});

test("login page has email and password inputs", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible({ timeout: 15000 });
  await expect(page.getByLabel("Password")).toBeVisible();
});

test("register page loads and shows create account", async ({ page }) => {
  await page.goto("/register");
  await expect(
    page.getByText("Create your account", { exact: true })
  ).toBeVisible({ timeout: 15000 });
});

test("register page has name, email, password fields", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByLabel("Full Name")).toBeVisible({ timeout: 15000 });
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password").first()).toBeVisible();
});
