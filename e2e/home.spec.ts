import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Next\.js/);
});

test("home page shows heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Next.js + Laravel API" })).toBeVisible();
});

test("Sign in link navigates to login", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/login/);
});

test("Create account link navigates to register", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/register/);
});
