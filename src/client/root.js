import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { ReduxAsyncConnect } from 'redux-connect';

import makeRoutes from '../shared/makeRoutes';

export default function (store) {
  const routes = makeRoutes(store);

  const Root = ({ history, helpers }) => (
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
    history: PropTypes.object.isRequired,
    helpers: PropTypes.object
  };

  return { Root, routes };
}
