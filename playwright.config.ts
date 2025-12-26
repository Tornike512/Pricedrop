import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

if (!process.env.CI) {
  loadEnvConfig(process.cwd());
} else {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

const SESSION_SECRET = process.env.SESSION_SECRET;
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!SESSION_SECRET) {
}

const PORT = 3001;
const ENV_VARS = {
  PORT: String(PORT),
  NODE_ENV: "test",
  NEXT_PUBLIC_API_URL: API_URL ?? "",
  SESSION_SECRET: SESSION_SECRET ?? "",
  TEST_USER_EMAIL: TEST_USER_EMAIL ?? "",
  TEST_USER_PASSWORD: TEST_USER_PASSWORD ?? "",
};

export default defineConfig({
  testDir: "./src/tests/e2e",
  timeout: process.env.CI ? 30 * 1000 : 15 * 1000,
  expect: {
    timeout: process.env.CI ? 30 * 1000 : 15 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "html" : "list",

  // Pass environment variables to test runner process
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    // Expose environment variables to test context
    testIdAttribute: "data-testid",
  },

  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },

    {
      name: "app",
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        // storageState: "./src/tests/.auth/admin.json",
      },
      // dependencies: ["setup"],
    },
  ],

  webServer: {
    command: process.env.CI ? "pnpm start" : "pnpm dev",
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: ENV_VARS, // This passes variables to the web server
    timeout: process.env.CI ? 120 * 1000 : 60 * 1000,
  },
});
