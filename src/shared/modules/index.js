import { routerReducer as router } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import { reducer as form } from 'redux-form';

import { reducer as apiClientMiddleware } from '../apiClientMiddleware';

import counter from './counter';
import user from './user';
import flashes from './flashes';

export default ({
  router,
  reduxAsyncConnect,
  form,
  apiClientMiddleware,
  counter,
  user,
  flashes
});
