import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { type ViteUserConfig, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react() as ViteUserConfig["plugins"]],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.tsx"],
    globalSetup: "./src/tests/setup/global-setup.ts",
    setupFiles: "./src/tests/setup/setup-test-env.tsx",
    restoreMocks: true,
    coverage: {
      include: ["src/**/*"],
      all: true,
      reportsDirectory: "./coverage",
    },
    globals: true,
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src/"),
    },
    conditions: ["browser", "node"],
  },
}) satisfies ViteUserConfig;