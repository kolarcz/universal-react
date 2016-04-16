import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { ReduxAsyncConnect } from 'redux-async-connect';

import ApiClient from '../shared/apiClient';
import makeStore from '../shared/makeStore';
import makeRoutes from '../shared/makeRoutes';
import makeHistory from '../shared/makeHistory';

const apiClient = new ApiClient();
const store = makeStore(apiClient, window.$STATE);
const history = makeHistory(store);
const routes = makeRoutes();

ReactDOM.render((
  <Provider store={store}>
    <Router
      history={history}
      render={(props) => (
        <ReduxAsyncConnect {...props} helpers={{ apiClient }} />
      )}
    >
      {routes}
    </Router>
  </Provider>
), document.getElementById('root'));
