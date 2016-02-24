import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from "react-helmet";

import { increase, increaseAsync, decrease } from '../modules/count';

class Counter extends Component {
  render() {
    const { count, increase, increaseAsync, decrease } = this.props;

    return (
      <div>
        <Helmet title="Counter" />
        <h2>Counter</h2>
        <button onClick={ () => increase() }>+</button>
        <button onClick={ () => increaseAsync() }>+ async</button>
        <button onClick={ () => decrease() }>-</button>
        <br/><br/>
        <span> {count}</span>
      </div>
    );
  }
};

export default connect(state => ({
  count: state.count
}), {
  increase, increaseAsync, decrease
})(Counter);
