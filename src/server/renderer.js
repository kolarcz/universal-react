import { match } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import React from 'react';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';

import ApiClient from '../shared/apiClient';
import makeRoutes from '../shared/makeRoutes';
import makeStore from '../shared/makeStore';

export default function (req, res) {
  if (__DEV__) {
    global.webpackIsomorphicTools.refresh();
  }

  const apiClient = new ApiClient(req);
  const store = makeStore(apiClient, undefined);
  const routes = makeRoutes(store);

  match({ routes, location: req.url }, async (error, redirectLocation, renderProps) => {
    if (error) {
      return res.status(500).end('Internal server error');
    } else if (redirectLocation) {
      return res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (!renderProps) {
      return res.status(404).end('Not found');
    }

    await loadOnServer({ ...renderProps, store, helpers: { apiClient } });

    const root = ReactDOMServer.renderToString(
      <Provider store={store}>
        <ReduxAsyncConnect {...renderProps} />
      </Provider>
    );

    const assets = global.webpackIsomorphicTools.assets();
    const helmet = Helmet.rewind();

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

    return true;
  });
}
