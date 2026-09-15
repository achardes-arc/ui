import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: 'http://127.0.0.1:3011', ...devices['Desktop Chrome'], reducedMotion: 'reduce', trace: 'retain-on-failure' },
  webServer: { command: 'pnpm dev --strictPort', url: 'http://127.0.0.1:3011', reuseExistingServer: !process.env.CI },
});
