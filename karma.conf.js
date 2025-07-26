// Karma configuration file
const puppeteer = require('puppeteer');

module.exports = function (config) {
  // Configurar la ruta de Chrome usando Puppeteer
  process.env.CHROME_BIN = puppeteer.executablePath();

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/frontend-empleados'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--no-sandbox',
          '--disable-web-security',
          '--disable-gpu',
          '--disable-dev-shm-usage'
        ]
      }
    },
    restartOnFileChange: true,
    singleRun: false
  });
};
