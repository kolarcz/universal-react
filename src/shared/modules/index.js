import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';

import counter from './counter';
import todos from './todos';
import user from './user';
import flash from './flash';

export default combineReducers({
  router,
  reduxAsyncConnect,
  counter,
  todos,
  user,
  flash
});
