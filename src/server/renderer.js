import { match } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import React from 'react';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
// import fs from 'fs';

import ApiClient from '../shared/apiClient';
import makeRoutes from '../shared/makeRoutes';
import makeStore from '../shared/makeStore';
import makeHistory from '../shared/makeHistory';

// var webpackConfig = require('../../webpack/makeConfig')(__ENV__);

export default function (req, res) {
  if (__DEV__) {
    global.webpackIsomorphicTools.refresh();
  }

  const apiClient = new ApiClient(req);
  const store = makeStore(apiClient, undefined);
  const history = makeHistory();
  const routes = makeRoutes();
  const location = history.createLocation(req.url);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      return res.status(500).end('Internal server error');
    } else if (redirectLocation) {
      return res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (!renderProps) {
      return res.status(404).end('Not found');
    }

    loadOnServer({ ...renderProps, store, helpers: { apiClient } }).then(() => {
      const root = ReactDOMServer.renderToString(
        <Provider store={store}>
          <ReduxAsyncConnect {...renderProps} />
        </Provider>
      );

      const assets = global.webpackIsomorphicTools.assets();
      const helmet = Helmet.rewind();

      /* if (!__DEV__ && req.isSpdy) {
        Object.keys(assets.styles).forEach((key, i) => {
          const file = assets.styles[key];
          res.push(file, { response: { 'Content-Type': 'text/css' } })
            .end(fs.readFileSync(webpackConfig.output.path + file, 'utf-8'));
        });
        Object.keys(assets.javascript).forEach((key, i) => {
          const file = assets.javascript[key];
          res.push(file, { response: { 'Content-Type': 'application/javascript' } })
            .end(fs.readFileSync(webpackConfig.output.path + file, 'utf-8'));
        });
      } */

      const stringifiedState = JSON.stringify(store.getState());
      const content = `<!DOCTYPE html>${ReactDOMServer.renderToString(
        <html {...helmet.htmlAttributes.toComponent()}>
          <head>
            <meta charSet="utf8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no"
            />
            {Object.keys(assets.styles).map((key, i) =>
              <link rel="stylesheet" type="text/css" href={assets.styles[key]} key={i} />
            )}
            {helmet.title.toComponent()}
            {helmet.base.toComponent()}
            {helmet.meta.toComponent()}
            {helmet.link.toComponent()}
            {helmet.script.toComponent()}
          </head>
          <body>
            <div id="root" dangerouslySetInnerHTML={{ __html: root }}></div>
            <script
              dangerouslySetInnerHTML={{ __html: `window.$STATE=${stringifiedState};` }}
            ></script>
            {Object.keys(assets.javascript).map((key, i) =>
              <script src={assets.javascript[key]} key={i} />
            )}
          </body>
        </html>
      )}`;

      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end(content);
    });

    return true;
  });
}
