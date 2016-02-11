require('babel-register');

var yargs = require('yargs');
var argv = yargs.default('env', 'production').argv;

global.__ENV__ = argv.env;
global.__DEV__ = __ENV__ == 'development';
global.__CLIENT__ = false;

if (argv.server) {
  require('./src/server');
}

if (argv.build) {
  var webpack = require('webpack');
  var webpackConfig = require('./webpack/config');

  webpack(webpackConfig, function (err, stats) {
    console.log('Compile:', err || 'done');
  });
}
