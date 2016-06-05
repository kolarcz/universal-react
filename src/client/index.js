import React from 'react';
import ReactDOM from 'react-dom';
import socketIo from 'socket.io-client';

import ApiClient from '../shared/apiClient';
import makeStore from '../shared/makeStore';
import makeHistory from '../shared/makeHistory';

global.socket = socketIo();

const apiClient = new ApiClient();
const store = makeStore(apiClient, window.$STATE);
const history = makeHistory(store);

const render = () => {
  const Root = require('./root');
  let forRender = <Root store={store} history={history} helpers={{ apiClient }} />;

  if (__DEV__) {
    const AppContainer = require('react-hot-loader').AppContainer;
    forRender = <AppContainer>{forRender}</AppContainer>;
  }

  ReactDOM.render(forRender, document.getElementById('root'));
};

render();

if (__DEV__ && module.hot) {
  module.hot.accept('./root', () => {
    render();
  });
}
