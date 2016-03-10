import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { increase, increaseAsync, decrease } from '../modules/count';

class Counter extends Component {
  render() {
    const { count, increase, increaseAsync, decrease } = this.props;

    return (
      <div>
        <Helmet title="Counter" />
        <h2>Counter</h2>

        <div className="uk-form">
          <input value={count} disabled /><br/><br/>

          <div className="uk-button-group">
            <button className="uk-button" onClick={ () => increase() }>
              <i className="uk-icon-plus"></i>
            </button>
            <button className="uk-button" onClick={ () => decrease() }>
              <i className="uk-icon-minus"></i>
            </button>
            <button className="uk-button" onClick={ () => increaseAsync() }>
              <i className="uk-icon-plus"></i> async
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default connect(state => ({
  count: state.count
}), {
  increase, increaseAsync, decrease
})(Counter);
