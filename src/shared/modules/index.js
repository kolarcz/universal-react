import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';

import counter from './counter';
import todos from './todos';

export default combineReducers({
  router,
  reduxAsyncConnect,
  counter,
  todos
});
