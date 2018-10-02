'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const config = require('karma').config;
const path = require('path');
const karmaConfig = config.parseConfig(
  path.resolve(__dirname, '../config/karma.conf.js')
);
const Server = require('karma').Server;
const server = new Server(karmaConfig, exitCode => {
  console.log('Karma has exited with ' + exitCode);
  process.exit(exitCode);
});

server.start();
