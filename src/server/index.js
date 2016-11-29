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
import path from 'path';
import WebpackIsomorphicTools from 'webpack-isomorphic-tools';

const CONFIG = process.env;
const basePath = path.resolve(`${__dirname}/../..`);

const app = express();
app.disable('x-powered-by');

const httpServer = CONFIG.PORT ? http.createServer(app) : null;
const httpsServer = CONFIG.PORT_SECURE ? spdy.createServer({
  key: fs.readFileSync(`${basePath}/${CONFIG.FILE_KEY}`),
  cert: fs.readFileSync(`${basePath}/${CONFIG.FILE_CRT}`)
}, app) : null;

const startListen = () => {
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

const loadRoutes = () => {
  app.use(require('./routes').default(CONFIG, sockets, startListen));

  app.use('/', express.static(`${basePath}/dist`));

  global.webpackIsomorphicTools
    .server(basePath, () => {
      app.get('*', (req, res) => {
        require('./renderer').default(req, res);
      });
    });
};

if (__DEV__) {
  const webpack = require('webpack');
  const webpackConfig = require('../../webpack/makeConfig')(__ENV__);
  const compiler = webpack(webpackConfig);
  const minimatch = require('minimatch');

  const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);
  const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
  });

  webpackDevMiddleware.waitUntilValid(loadRoutes);

  app.use(webpackHotMiddleware);
  app.use(webpackDevMiddleware);

  compiler.plugin('done', () => {
    minimatch.match(
      Object.keys(require.cache),
      `${basePath}/src/{shared/**,server/renderer.js}`
    ).forEach((modulePath) => {
      delete require.cache[modulePath];
    });
  });
}

global.webpackIsomorphicTools = new WebpackIsomorphicTools(
  require('../../webpack/makeAssets')(__ENV__)
);

if (!__DEV__) {
  loadRoutes();
}
