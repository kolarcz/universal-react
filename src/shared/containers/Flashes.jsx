import React, { PropTypes } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import { del as deleteFlash } from '../modules/flashes';

import css from './Flashes.scss';

import Flash from './Flash';

const Flashes = ({ flashes, deleteFlash }) => (
  <div className={css.flashes}>
    <div className="container">
      <div className={`row ${css.row}`}>
        <div className={`col-sm-5 col-sm-offset-7 ${css.col}`}>
          <CSSTransitionGroup
            transitionName={{
              enter: css.alert,
              active: css.alert,
              leave: css.alertLeave
            }}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            {flashes.map((flash, i) => (
              flash && <Flash
                key={i}
                type={flash.type}
                message={flash.message}
                dismiss={() => deleteFlash(i)}
              />
            ))}
          </CSSTransitionGroup>
        </div>
      </div>
    </div>
  </div>
);

Flashes.propTypes = {
  flashes: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['success', 'error']).isRequired,
    message: PropTypes.string.isRequired
  })).isRequired,
  deleteFlash: PropTypes.func.isRequired
};

export default connect(state => ({
  flashes: state.flashes
}), {
  deleteFlash
})(Flashes);
