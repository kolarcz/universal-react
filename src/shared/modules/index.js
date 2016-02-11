import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';

import count from './count';

export default combineReducers({
  routing: routeReducer,
  count
});
