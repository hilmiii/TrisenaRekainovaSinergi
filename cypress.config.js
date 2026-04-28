// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    baseUrl: 'https://trisena-rekainova-sinergi.com', // URL Vercel Anda
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000, // Menambah waktu tunggu (timeout) untuk antisipasi loading di production
  },
});