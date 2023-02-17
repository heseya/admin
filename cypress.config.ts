import path from 'path'
import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
  projectId: 'gsz6kh',
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  viewportHeight: 1080,
  viewportWidth: 1920,

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('file:preprocessor', vitePreprocessor(path.resolve(__dirname, './vite.config.ts')))
      return require('./tests/e2e/plugins/index.ts').default(on, config)
    },
    specPattern: 'tests/e2e/specs/**/*.spec.ts',
    supportFile: 'tests/e2e/support/index.ts',
  },
})
