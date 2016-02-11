import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from "react-helmet";

class Page2 extends Component {
  render() {
    return (
      <div>
        <Helmet title="Page2" />
        <span>Page 2</span>
      </div>
    );
  }
};

export default Page2;
