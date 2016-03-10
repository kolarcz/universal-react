import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import makeStore from '../shared/makeStore';
import makeRoutes from '../shared/makeRoutes';
import makeHistory from '../shared/makeHistory';

const store = makeStore(window.$STATE);
const history = makeHistory(store);
const routes = makeRoutes();

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
), document.getElementById('root'));
