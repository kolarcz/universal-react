import express from 'express';
import session from 'express-session';
import forceSSL from 'express-force-ssl';
import compress from 'compression';
import bodyParser from 'body-parser';
import spdy from 'spdy';
import fs from 'fs';

const CONFIG = require('../../config');

const app = express();

if (CONFIG.ports.plain && CONFIG.ports.secure) {
  app.set('forceSSLOptions', { httpsPort: CONFIG.ports.secure });
  app.use(forceSSL);
}

app.use(compress());
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (__DEV__) {
  const webpack = require('webpack');
  const webpackConfig = require('../../webpack/config');
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath, noInfo: true
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use('/', express.static(`${__dirname}/../../dist`));

if (CONFIG.ports.secure) {
  spdy.createServer({
    key: fs.readFileSync(`${__dirname}/../../${CONFIG.certs.key}`),
    cert: fs.readFileSync(`${__dirname}/../../${CONFIG.certs.cert}`)
  }, app).listen(CONFIG.ports.secure, (err) => {
    console.log(`HTTPS at port ${CONFIG.ports.secure}:`, err || 'started');
  });
}

if (CONFIG.ports.plain) {
  app.listen(CONFIG.ports.plain, (err) => {
    console.log(`HTTP at port ${CONFIG.ports.plain}:`, err || 'started');
  });
}


const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../../webpack/assets'));

global.webpackIsomorphicTools
  .development(__DEV__)
  .server(`${__dirname}/../../`, () => {
    app.get('*', require('./renderer').default);
  });
