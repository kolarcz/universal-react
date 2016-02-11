import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from "react-helmet";

import { increase, increaseAsync, decrease } from '../modules/count';

class Page1 extends Component {
  render() {
    const { count, increase, increaseAsync, decrease } = this.props;

    return (
      <div>
        <Helmet title="Page1" />
        <button onClick={ () => increase() }>+</button>
        <button onClick={ () => increaseAsync() }>+ async</button>
        <button onClick={ () => decrease() }>-</button>
        <span> {count}</span><br/>
        <input/>
      </div>
    );
  }
};

export default connect(state => ({
  count: state.count
}), {
  increase, increaseAsync, decrease
})(Page1);
