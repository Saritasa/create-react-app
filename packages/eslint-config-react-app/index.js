/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

// Inspired by https://github.com/airbnb/javascript but less opinionated.

// We use eslint-loader so even warnings are very visible.
// This is why we only use "WARNING" level for potential errors,
// and we don't use "ERROR" level at all.

// In the future, we might create a separate list of rules for production.
// It would probably be more strict.

// The ESLint browser environment defines all browser globals as valid,
// even though most people don't know some of them exist (e.g. `name` or `status`).
// This is dangerous as it hides accidentally undefined variables.
// We blacklist the globals that we deem potentially confusing.
// To use them, explicitly reference them, e.g. `window.name` or `window.status`.
var restrictedGlobals = require('confusing-browser-globals');

process.env.NODE_ENV = 'test';
require('./env');

module.exports = {
  root: true,

  extends: '@saritasa/eslint-config-react',

  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
        extensions: ['.js', '.jsx'],
      },
    },
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },

  rules: {
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
    'no-restricted-properties': [
      'error',
      {
        object: 'require',
        property: 'ensure',
        message:
          'Please use import() instead. More info: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting',
      },
      {
        object: 'System',
        property: 'import',
        message:
          'Please use import() instead. More info: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting',
      },
    ],
    'import/newline-after-import': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.unit.js', '**/*.stories.js'] },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
      },
    ],
  },
  overrides: [
    {
      files: ['src/**/*.unit.js'],
      plugins: ['chai-expect', 'mocha'],
      env: {
        browser: true,
        commonjs: true,
        es6: true,
        mocha: true,
      },
      rules: {
        'global-require': 'off',
        'import/no-extraneous-dependencies': 'off',
        'require-jsdoc': 'off',
        'prefer-arrow-callback': 'off',
        'chai-expect/missing-assertion': 'error',
        'chai-expect/terminating-properties': 'error',
        'chai-expect/no-inner-compare': 'error',

        'mocha/handle-done-callback': 'error',
        'mocha/no-global-tests': 'error',
        'mocha/no-identical-title': 'error',
        'mocha/no-mocha-arrows': 'error',
        'mocha/no-nested-tests': 'error',
        'mocha/no-return-and-callback': 'error',
        'mocha/no-sibling-hooks': 'error',
        'mocha/no-top-level-hooks': 'error',
      },
    },
    {
      files: ['src/**/__mocks__/**/*.js'],
      env: {
        browser: true,
        commonjs: true,
        es6: true,
      },
      rules: {
        'global-require': 'off',
        'require-jsdoc': 'off',
        'prefer-arrow-callback': 'off',
      },
    },
    {
      files: ['src/**/*.stories.js'],
      plugins: [],
      env: {
        browser: true,
        commonjs: true,
        es6: true,
      },
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'require-jsdoc': 'off',
      },
    },
  ],
};
