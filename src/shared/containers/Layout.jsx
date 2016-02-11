import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from "react-helmet";

import './Layout.scss';

class Layout extends Component {
  render() {
    return (
      <div>
        <Helmet link={[
          {rel: 'shortcut icon', href: require('../favicon.ico')}
        ]} />
      <h1>Test</h1>
        <ul>
          <li><Link to="/">page1</Link></li>
          <li><Link to="/page2/123">page2</Link></li>
        </ul>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
};

export default Layout;
