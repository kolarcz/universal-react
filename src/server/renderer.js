/* eslint-disable react/no-danger */

import { match } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import React from 'react';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import serialize from 'serialize-javascript';

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

    await loadOnServer({ ...renderProps, store });

    const root = ReactDOMServer.renderToString(
      <Provider store={store}>
        <ReduxAsyncConnect {...renderProps} />
      </Provider>
    );

    const assets = global.webpackIsomorphicTools.assets();
    const helmet = Helmet.renderStatic();

    const serializedState = serialize(store.getState());
    const content = `<!DOCTYPE html>${ReactDOMServer.renderToString(
      <html lang="en" {...helmet.htmlAttributes.toComponent()}>
        <head>
          <meta charSet="utf8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no"
          />
          {Object.keys(assets.styles).map(key =>
            <link rel="stylesheet" type="text/css" href={assets.styles[key]} key={key} />
          )}
          {helmet.base.toComponent()}
          {helmet.link.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.noscript.toComponent()}
          {helmet.script.toComponent()}
          {helmet.style.toComponent()}
          {helmet.title.toComponent()}
        </head>
        <body {...helmet.bodyAttributes.toComponent()}>
          <div id="root" dangerouslySetInnerHTML={{ __html: root }} />
          <script dangerouslySetInnerHTML={{ __html: `window.$STATE=${serializedState};` }} />
          {Object.keys(assets.javascript).map(key =>
            <script src={assets.javascript[key]} key={key} />
          )}
        </body>
      </html>
    )}`;

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.end(content);

    return true;
  });
}
