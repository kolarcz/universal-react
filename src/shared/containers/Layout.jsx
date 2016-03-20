import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import activeComponent from 'react-router-active-component';

const Link = activeComponent('li', { linkClassName: 'uk-offcanvas-close' });

import 'bootstrap/dist/css/bootstrap.min.css';

if (__CLIENT__) {
  require('script!jquery/dist/jquery.min.js');
  require('script!bootstrap/dist/js/bootstrap.min.js');
}

class Layout extends Component {
  render() {
    return (
      <div>
        <Helmet link={[{ rel: 'shortcut icon', href: require('../favicon.ico') }]} />

        <header className="navbar navbar-default navbar-static-top" id="top" role="banner">
          <div className="container">
            <div className="navbar-header">
              <button
                className="navbar-toggle collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#bs-navbar"
              >
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <span className="navbar-brand">
                <span className="glyphicon glyphicon-leaf"></span> Universal React
              </span>
            </div>
            <nav id="bs-navbar" className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <Link to="/" onlyActiveOnIndex>Home</Link>
                <Link to="/counter" key="/counter">Counter</Link>
                <Link to="/todos" key="/todo">Todos</Link>
              </ul>
            </nav>
          </div>
        </header>

        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.object.isRequired
};

export default Layout;
