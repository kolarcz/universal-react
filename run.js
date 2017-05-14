require('babel-register');
require('dotenv').config();

const fs = require('fs');
const program = require('commander');

program
  .option('-b, --build', 'build production files')
  .option('-s, --server <env>', 'run server with selected env', /^(development|production)$/, null)
  .parse(process.argv);

if (program.build) {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack/makeConfig')('production');

  webpack(webpackConfig, (err, stats) => {
    fs.writeFile(
      './webpack/stats.json',
      JSON.stringify(stats.toJson('verbose')),
      'utf8'
    );
  });
}

if (program.server) {
  global.__ENV__ = program.server;
  global.__DEV__ = __ENV__ === 'development';
  global.__CLIENT__ = false;

  require('./src/server');
}
