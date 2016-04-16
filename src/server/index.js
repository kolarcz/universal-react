import express from 'express';
import session from 'express-session';
import forceSSL from 'express-force-ssl';
import compress from 'compression';
import bodyParser from 'body-parser';
import spdy from 'spdy';
import fs from 'fs';
import { defaultsDeep } from 'lodash';

const CONFIG = defaultsDeep({
  sessionSecret: process.env.SESSION_SECRET,
  ports: {
    plain: process.env.PORT,
    secure: process.env.PORT_SECURE
  },
  social: {
    facebook: {
      clientId: process.env.SOCIAL_FACEBOOK_ID,
      clientSecret: process.env.SOCIAL_FACEBOOK_SECRET,
      callbackUrl: process.env.SOCIAL_FACEBOOK_URL
    },
    google: {
      clientId: process.env.SOCIAL_GOOGLE_ID,
      clientSecret: process.env.SOCIAL_GOOGLE_SECRET,
      callbackUrl: process.env.SOCIAL_GOOGLE_URL
    }
  }
}, require('../../config'));

const app = express();

if (CONFIG.ports.plain && CONFIG.ports.secure) {
  app.set('forceSSLOptions', { httpsPort: CONFIG.ports.secure });
  app.use(forceSSL);
}

app.use(compress());
app.use(session({
  secret: CONFIG.sessionSecret,
  resave: false,
  saveUninitialized: true,
  name: 'sid'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  require('./routes').default(CONFIG)(req, res, next);
});

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
    app.get('*', (req, res) => {
      require('./renderer').default(req, res);
    });
  });
