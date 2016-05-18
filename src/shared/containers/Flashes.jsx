import React, { PropTypes } from 'react';

import './Flashes.scss';

const Flashes = ({ flashes }) => (
  <div className="flashes">
    <div className="container">
      <div className="row">
        <div className="col-sm-5 col-sm-offset-7">
          {flashes.map((f, key) => (
            <div
              key={key}
              role="alert"
              className={
                `alert-${
                  f.type === 'success' ? 'success' : 'danger'
                } alert alert-dismissible fade in`
              }
            >
              <button type="button" className="close" data-dismiss="alert">×</button>
              {f.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

Flashes.propTypes = {
  flashes: PropTypes.array.isRequired
};

export default Flashes;
