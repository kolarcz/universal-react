import express from 'express';
import session from 'express-session';
import forceSSL from 'express-force-ssl';
import connectFlash from 'connect-flash';
import compress from 'compression';
import bodyParser from 'body-parser';
import http from 'http';
import spdy from 'spdy';
import socketIo from 'socket.io';
import fs from 'fs';

const CONFIG = process.env;

const app = express();
app.disable('x-powered-by');

const httpServer = CONFIG.PORT ? http.createServer(app) : null;
const httpsServer = CONFIG.PORT_SECURE ? spdy.createServer({
  key: fs.readFileSync(`${__dirname}/../../${CONFIG.FILE_KEY}`),
  cert: fs.readFileSync(`${__dirname}/../../${CONFIG.FILE_CRT}`)
}, app) : null;

const listen = () => {
  if (CONFIG.PORT_SECURE) {
    httpsServer.listen(CONFIG.PORT_SECURE, (err) => {
      console.log(`HTTPS at port ${CONFIG.PORT_SECURE}:`, err || 'started');
    });
  }

  if (CONFIG.PORT) {
    httpServer.listen(CONFIG.PORT, (err) => {
      console.log(`HTTP at port ${CONFIG.PORT}:`, err || 'started');
    });
  }
};

if (CONFIG.PORT && CONFIG.PORT_SECURE) {
  app.set('forceSSLOptions', { httpsPort: CONFIG.PORT_SECURE });
  app.use(forceSSL);
}

const sessionMiddleware = session({
  secret: CONFIG.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: 'sid'
});

app.use(compress());
app.use(sessionMiddleware);
app.use(connectFlash());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const sockets = socketIo(httpsServer || httpServer);
sockets.use((socket, next) => sessionMiddleware(socket.request, {}, next));
app.use(require('./routes').default(CONFIG, sockets));


if (__DEV__) {
  const webpack = require('webpack');
  const webpackConfig = require('../../webpack/makeConfig')(__ENV__);
  const compiler = webpack(webpackConfig);

  const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);
  const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
  });

  webpackDevMiddleware.waitUntilValid(listen);

  app.use(webpackHotMiddleware);
  app.use(webpackDevMiddleware);
}

app.use('/', express.static(`${__dirname}/../../dist`));

if (!__DEV__) {
  listen();
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
