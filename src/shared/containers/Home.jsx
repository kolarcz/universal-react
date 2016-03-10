import React, { Component } from 'react';
import Helmet from 'react-helmet';

class Home extends Component {
  render() {
    return (
      <div>
        <Helmet title="Home" />
        <h2>Home</h2>
      </div>
    );
  }
};

export default Home;
