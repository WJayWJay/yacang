import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';

import styles from './index.css';

function Product() {
  return (
    <div className={styles.normal}>
      <WingBlank>
        <Button>default</Button><WhiteSpace />
      </WingBlank>
      <ul className={styles.list}>
        <li><Link to="/">home</Link></li>
      </ul>
    </div>
  );
}

Product.propTypes = {
};

export default connect()(Product);
