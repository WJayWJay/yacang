import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './spinner.less';

function Spinner({ loading }) {
  const svgCls = classnames({
    [styles.spinner]: true,
    [styles.show]: loading,
  });
  return (
    <div>
      <svg className={svgCls} width="50px" height="50px" viewBox="0 0 44 44">
        <circle className={styles.path} fill="none" strokeWidth="4" strokeLinecap="round" cx="22" cy="22" r="20" />
      </svg>
    </div>
  );
}

Spinner.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default Spinner;
