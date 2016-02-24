import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
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
        <menu>
          <li><IndexLink activeClassName="active" to="/">Home</IndexLink></li>
          <li><Link activeClassName="active" to="/counter">Counter</Link></li>
          <li><Link activeClassName="active" to="/todo">Todo</Link></li>
        </menu>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
};

export default Layout;
