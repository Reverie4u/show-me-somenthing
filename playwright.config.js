const { defineConfig, devices } = require('@playwright/test');

const HOST = 'http://127.0.0.1:8100';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: HOST,
    headless: true,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 8100 --bind 127.0.0.1',
    url: HOST,
    reuseExistingServer: true,
    timeout: 15_000,
  },
});
