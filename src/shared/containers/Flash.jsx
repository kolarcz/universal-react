import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Flash extends Component {

  componentDidMount() {
    setTimeout(this.props.dismiss, 2500);
  }

  render() {
    const { type, message, dismiss } = this.props;
    return (
      <div className={`alert alert-${type === 'success' ? 'success' : 'danger'}`}>
        <button className="close" onClick={dismiss}>×</button>
        {message}
      </div>
    );
  }

}

Flash.propTypes = {
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  message: PropTypes.string.isRequired,
  dismiss: PropTypes.func.isRequired
};

export default Flash;
