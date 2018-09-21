'use strict';
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require(path.resolve(
  __dirname,
  '../config/webpack.config.dev.js'
));

const browsers = (process.env.KARMA_BROWSERS || 'jsdom').split(',');
const singleRun = Boolean(process.env.KARMA_SINGLE_RUN);
// Karma configuration
// Generated on Fri Aug 10 2018 10:43:10 GMT+0500 (+05)
module.exports = config => {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: path.resolve(__dirname, '../../../..'),

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: ['src/setupTest.js'],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // add webpack as preprocessor
      'src/setupTest.js': ['webpack'],
    },

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
    concurrency: Infinity,

    // Webpack settings
    webpack: {
      mode: 'development',
      module: Object.assign({}, webpackConfig.module, {
        rules: [
          ...webpackConfig.module.rules,
          {
            test: /\.js$|\.jsx$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: {
                esModules: true,
                produceSourceMap: true,
              },
            },
            enforce: 'post',
            exclude: /node_modules|\.spec\.js$|\.unit\.js$|\.stories\.js$/,
          },
        ],
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
  });
};
