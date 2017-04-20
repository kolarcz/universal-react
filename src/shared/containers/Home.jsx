import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { add as addFlash } from '../modules/flashes';

const Home = ({ addFlash }) => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>

    <h1>Home</h1>

    <button className="btn btn-success" onClick={() => addFlash('success', 'Success example')}>
      Show success flash
    </button>
    {' '}
    <button className="btn btn-danger" onClick={() => addFlash('error', 'Error example')}>
      Show error flash
    </button>
  </div>
);

Home.propTypes = {
  addFlash: PropTypes.func.isRequired
};

export default connect(null, { addFlash })(Home);
