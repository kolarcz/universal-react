import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';

import count from './count';
import todo from './todo';

export default combineReducers({
  routing: routeReducer,
  count,
  todo
});
