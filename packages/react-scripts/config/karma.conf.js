'use strict';
const path = require('path');
const os = require('os');

const webpack = require('webpack');
const RewiremockWebpackPlugin = require('rewiremock/webpack/plugin');
const webpackConfig = require(path.resolve(
  __dirname,
  '../config/webpack.config.dev.js'
));

webpackConfig.entry.pop(); // remove index.js
webpackConfig.entry.unshift(require.resolve('rewiremock/webpack/interceptor'));
webpackConfig.plugins.push(new webpack.NamedModulesPlugin());
webpackConfig.plugins.push(new RewiremockWebpackPlugin());

const browsers = (process.env.KARMA_BROWSERS || 'jsdom').split(',');
const singleRun = Boolean(process.env.KARMA_SINGLE_RUN);

// if (browsers.includes('selenium_ie')) {
//   webpackConfig.devtool = 'source-map';
// }

const getWebDriverConfig = (desiredCapabilities) => {
  return {
    desiredCapabilities,
    host: process.env.SELENIUM_GRID_HOST,
    port: Number(process.env.SELENIUM_GRID_PORT) || 4444,
    path: process.env.SELENIUM_GRID_PATH || '/wd/hub',
  };
};

const externalHostnames = Object.values(os.networkInterfaces())
  .map(inter => inter.find(address => address.family === 'IPv4'))
  .filter(Boolean)
  .filter(inter => !inter.internal)
  .map(inter => inter.address);

console.log(`External hostnames: ${externalHostnames.join(', ')}`);

const hostname = process.env.KARMA_HOSTNAME || externalHostnames[0] || 'localhost';

console.log(`Use hostname: ${hostname}`);

// Karma configuration
// Generated on Fri Aug 10 2018 10:43:10 GMT+0500 (+05)
module.exports = config => {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: path.resolve(__dirname, '../../../..'),
    browserDisconnectTolerance:
      Number(process.env.KARMA_BROWSER_DISCONNECT_TOLERANCE) || 2,
    browserDisconnectTimeout:
      Number(process.env.KARMA_BROWSER_DISCONNECT_TIMEOUT) || 10000,
    browserNoActivityTimeout:
      Number(process.env.KARMA_BROWSER_NO_ACTIVITY_TIMEOUT) || 60000,
    captureTimeout: Number(process.env.KARMA_CAPTURE_TIMEOUT) || 60000,
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    plugins: ['karma-*', '@saritasa/karma-selenium-launcher'],
    // list of files / patterns to load in the browser
    files: [
      process.env.REACT_APP_KARMA_ONLY_CHANGED
        ? 'src/setupTest.updated.js'
        : 'src/setupTest.js',
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: process.env.REACT_APP_KARMA_ONLY_CHANGED
      // add webpack as preprocessor
      ? { 'src/setupTest.updated.js': ['webpack'] }
      : { 'src/setupTest.js': ['webpack'] },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'mocha',
      process.env.KARMA_COVERAGE_REPORT ? 'coverage-istanbul' : null,
    ].filter(Boolean),
    // use proper diff displaying:
    // - expected
    // - actual
    mochaReporter: {
      showDiff: true,
    },
    // config for istanbul coverage tool
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      'report-config': {
        // all options available at: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib/html/index.js#L135-L137
        html: {
          // outputs the report in ./coverage/html
          subdir: 'html',
        },
      },
      fixWebpackSourcePaths: true,
    },

    hostname,
    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Number(process.env.KARMA_CONCURRENCY) || Infinity,

    // Webpack settings
    webpack: {
      mode: 'development',
     // devtool: webpackConfig.devtool,
      module: Object.assign({}, webpackConfig.module, {
        rules: [
          ...webpackConfig.module.rules,
          process.env.KARMA_COVERAGE_REPORT ? {
            test: /\.js$|\.jsx$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: {
                esModules: true,
                produceSourceMap: false,
                compact: false,
              },
            },
            enforce: 'post',
            exclude: /node_modules|__mocks__|\/libs\/|\.spec\.js$|\.unit\.js$|\.stories\.js$/,
          } : null,
        ].filter(Boolean),
      }),
      plugins: [
        ...webpackConfig.plugins,
        process.env.KARMA_COVERAGE_REPORT
          ? new webpack.SourceMapDevToolPlugin({
            filename: null,
            test: /\.(jsx|js)($|\?)/i,
          })
          : null,
      ].filter(Boolean),
      resolve: webpackConfig.resolve,
      node: webpackConfig.node,
    },
    webpackServer: {
      noInfo: true,
    },
    customLaunchers: {
      selenium_chrome: {
        base: 'Selenium',
        config: getWebDriverConfig({
          name: 'Karma Chrome',
          browserName: 'chrome'
        }),
        name: 'Karma Chrome',
        browserName: 'chrome'
      },
      selenium_firefox: {
        base: 'Selenium',
        config: getWebDriverConfig({
          name: 'Karma Firefox',
          browserName: 'firefox'
        }),
        name: 'Karma Firefox',
        browserName: 'firefox'
      },
      selenium_ie: {
        base: 'Selenium',
        config: getWebDriverConfig({
          name: 'Karma IE',
          browserName: 'internet explorer'
        }),
        name: 'Karma IE',
        browserName: 'internet explorer'
      },
      selenium_edge: {
        base: 'Selenium',
        config: getWebDriverConfig({
          name: 'Karma Edge',
          browserName: 'MicrosoftEdge'
        }),
        name: 'Karma Edge',
        browserName: 'MicrosoftEdge'
      },
      selenium_safari: {
        base: 'Selenium',
        config: getWebDriverConfig({
          name: 'Karma Safari',
          browserName: 'safari'
        }),
        name: 'Karma Safari',
        browserName: 'safari'
      },
    },
  });
};
