/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const create = require('babel-preset-react-app');

module.exports = function(api, opts) {
  // This is similar to how `env` works in Babel:
  // https://babeljs.io/docs/usage/babelrc/#env-option
  // We are not using `env` because it’s ignored in versions > babel-core@6.10.4:
  // https://github.com/babel/babel/issues/4539
  // https://github.com/facebook/create-react-app/issues/720
  // It’s also nice that we can enforce `NODE_ENV` being specified.
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;

  var result = create(api, opts);

  if (env === 'production' || env === 'development') return result;

  Object.assign(result.presets[0][1], {targets :{ ie: 9 },
    // Users cannot override this behavior because this Babel
    // configuration is highly tuned for ES5 support
    ignoreBrowserslistConfig: true,
    // If users import all core-js they're probably not concerned with
    // bundle size. We shouldn't rely on magic to try and shrink it.
    useBuiltIns: false,
    // Do not transform modules to CJS
    modules: false,
    // Exclude transforms that make all code slower
    exclude: ['transform-typeof-symbol'],
  });

  return result;
};
