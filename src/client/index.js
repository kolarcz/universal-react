import React from 'react';
import ReactDOM from 'react-dom';
import socketIo from 'socket.io-client';
import { match } from 'react-router';

import ApiClient from '../shared/apiClient';
import makeStore from '../shared/makeStore';
import makeHistory from '../shared/makeHistory';

global.socket = socketIo();

const apiClient = new ApiClient();
const store = makeStore(apiClient, window.$STATE);
const history = makeHistory(store);

const render = () => {
  const { Root, routes } = require('./root')(store);
  let forRender = <Root history={history} helpers={{ apiClient }} />;

  if (__DEV__) {
    const AppContainer = require('react-hot-loader').AppContainer;
    forRender = <AppContainer>{forRender}</AppContainer>;
  }

  const { pathname, search, hash } = window.location;
  const location = `${pathname}${search}${hash}`;

  match({ routes, location }, () => {
    ReactDOM.render(forRender, document.getElementById('root'));
  });
};

render();

if (module.hot) {
  module.hot.accept('./root', () => {
    render();
  });
}
