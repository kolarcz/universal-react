import React from 'react';
import ReactDOM from 'react-dom';
import socketIo from 'socket.io-client';
import { match } from 'react-router';
import { AppContainer } from 'react-hot-loader';

import ApiClient from '../shared/apiClient';
import makeStore from '../shared/makeStore';
import makeHistory from '../shared/makeHistory';

global.socket = socketIo();

const apiClient = new ApiClient();
const store = makeStore(apiClient, window.$STATE);
const history = makeHistory(store);

const render = () => {
  const { Root, routes } = require('./root');

  const { pathname, search, hash } = window.location;
  const location = `${pathname}${search}${hash}`;

  match({ routes, location }, () => {
    ReactDOM.render((
      <AppContainer>
        <Root store={store} history={history} helpers={{ apiClient }} />
      </AppContainer>
    ), document.getElementById('root'));
  });
};

render();

if (__DEV__ && module.hot) {
  module.hot.accept('./root', () => {
    render();
  });
}
