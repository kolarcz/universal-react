import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { ReduxAsyncConnect } from 'redux-connect';

import makeRoutes from '../shared/makeRoutes';

const routes = makeRoutes();

const Root = ({ store, history, helpers }) => (
  <Provider store={store}>
    <Router
      history={history}
      render={(props) => (<ReduxAsyncConnect {...props} helpers={helpers} />)}
    >
      {routes}
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  helpers: PropTypes.object
};

export { Root, routes };
