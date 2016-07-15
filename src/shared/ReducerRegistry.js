import { combineReducers } from 'redux';

class ReducerRegistry {

  constructor(initialReducers = {}, initialState = {}) {
    this._reducers = { ...initialReducers };
    this._listener = null;

    if (typeof initialState === 'object') {
      Object.keys(initialState).forEach(key => {
        if (!this._reducers.hasOwnProperty(key)) {
          this._reducers[key] = (state = null) => state;
        }
      });
    }
  }

  register(newReducers) {
    this._reducers = { ...this._reducers, ...newReducers };
    if (this._listener != null) {
      this._listener(this.getMainReducer());
    }
  }

  getMainReducer() {
    return combineReducers({ ...this._reducers });
  }

  setChangeListener(listener) {
    if (this._listener != null) {
      throw new Error('Can only set the listener for a ReducerRegistry once.');
    }
    this._listener = listener;
  }

}

export default ReducerRegistry;
