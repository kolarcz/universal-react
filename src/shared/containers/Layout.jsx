import React, { Component } from 'react';
import Helmet from 'react-helmet';
import ActiveComponent from 'react-router-active-component';

const Link = ActiveComponent('li', { linkClassName: 'uk-offcanvas-close' });

import '../assets/styles/uikit.min.css';

if (__CLIENT__) {
  require('script!../assets/scripts/jquery.min.js');
  require('script!../assets/scripts/uikit.min.js');
}

class Layout extends Component {
  getLogo() {
    return (
      <span>
        <i className="uk-icon-cube"></i> Universal React
      </span>
    );
  }

  getLinks() {
    return [
      <Link activeClassName="uk-active" to="/" key="/" onlyActiveOnIndex>Home</Link>,
      <Link activeClassName="uk-active" to="/counter" key="/counter">Counter</Link>,
      <Link activeClassName="uk-active" to="/todo" key="/todo">Todo</Link>
    ];
  }

  render() {
    return (
      <div className="uk-container uk-container-center">
        <Helmet link={[
          {rel: 'shortcut icon', href: require('../favicon.ico')}
        ]} />

        <div id="offcanvas-navbar" className="uk-offcanvas">
          <div className="uk-offcanvas-bar">
            <ul className="uk-nav uk-nav-offcanvas">
              {this.getLinks()}
            </ul>
          </div>
        </div>

        <nav className="uk-navbar uk-margin-top uk-margin-bottom">
          <a href="#offcanvas-navbar" className="uk-navbar-toggle uk-visible-small" data-uk-offcanvas></a>
          <span className="uk-navbar-brand uk-hidden-small">
            {this.getLogo()}
          </span>
          <span className="uk-navbar-brand uk-navbar-center uk-visible-small" style={{maxWidth: '65%'}}>
            {this.getLogo()}
          </span>
          <ul className="uk-navbar-nav uk-hidden-small">
            {this.getLinks()}
          </ul>
        </nav>

        {this.props.children}
      </div>
    );
  }
};

export default Layout;
