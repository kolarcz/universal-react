import express from 'express';
import session from 'express-session';
import forceSSL from 'express-force-ssl';
import connectFlash from 'connect-flash';
import compress from 'compression';
import bodyParser from 'body-parser';
import spdy from 'spdy';
import fs from 'fs';

const CONFIG = process.env;

const app = express();
app.disable('x-powered-by');

if (CONFIG.PORT && CONFIG.PORT_SECURE) {
  app.set('forceSSLOptions', { httpsPort: CONFIG.PORT_SECURE });
  app.use(forceSSL);
}

app.use(compress());
app.use(session({
  secret: CONFIG.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: 'sid'
}));
app.use(connectFlash());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  require('./routes').default(CONFIG)(req, res, next);
});

if (__DEV__) {
  const webpack = require('webpack');
  const webpackConfig = require('../../webpack/makeConfig')(__ENV__);
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath, noInfo: true
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use('/', express.static(`${__dirname}/../../dist`));

if (CONFIG.PORT_SECURE) {
  spdy.createServer({
    key: fs.readFileSync(`${__dirname}/../../${CONFIG.FILE_KEY}`),
    cert: fs.readFileSync(`${__dirname}/../../${CONFIG.FILE_CRT}`)
  }, app).listen(CONFIG.PORT_SECURE, (err) => {
    console.log(`HTTPS at port ${CONFIG.PORT_SECURE}:`, err || 'started');
  });
}

if (CONFIG.PORT) {
  app.listen(CONFIG.PORT, (err) => {
    console.log(`HTTP at port ${CONFIG.PORT}:`, err || 'started');
  });
}

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(
  require('../../webpack/makeAssets')(__ENV__)
);

global.webpackIsomorphicTools
  .development(__DEV__)
  .server(`${__dirname}/../../`, () => {
    app.get('*', (req, res) => {
      require('./renderer').default(req, res);
    });
  });
