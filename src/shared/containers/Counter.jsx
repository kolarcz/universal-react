import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { increase, increaseAsync, decrease } from '../modules/counter';

const Counter = ({ counter, increase, increaseAsync, decrease }) => (
  <div>
    <Helmet>
      <title>Counter</title>
    </Helmet>

    <h1>Counter</h1>

    <div className="form-horizontal">
      <div className="form-group">
        <div className="col-sm-4">
          <input className="form-control" value={counter} disabled />
        </div>
      </div>
      <div className="form-group">
        <div className="col-sm-12">
          <div className="btn-group" role="group">
            <button className="btn btn-success" onClick={increase}>
              <span className="glyphicon glyphicon-plus" />
            </button>
            <button className="btn btn-warning" onClick={decrease}>
              <span className="glyphicon glyphicon-minus" />
            </button>
            <button className="btn btn-danger" onClick={increaseAsync}>
              <span className="glyphicon glyphicon-plus" /> Async
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  increase: PropTypes.func.isRequired,
  increaseAsync: PropTypes.func.isRequired,
  decrease: PropTypes.func.isRequired
};

export default connect(state => ({
  counter: state.counter
}), {
  increase, increaseAsync, decrease
})(Counter);
