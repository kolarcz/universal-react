require('babel-register');

const yargs = require('yargs');
const argv = yargs.default('env', 'production').argv;

global.__ENV__ = argv.env;
global.__DEV__ = __ENV__ === 'development';
global.__CLIENT__ = false;

if (argv.server) {
  require('./src/server');
}

if (argv.build) {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack/config');

  webpack(webpackConfig, (err) => {
    console.log('Compile:', err || 'done');
  });
}
