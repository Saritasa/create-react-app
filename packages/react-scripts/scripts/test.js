'use strict';

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
