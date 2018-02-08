import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import Layout from '../../components/layout'

import styles from './index.less';

function Product() {
  return (
    <Layout>
      <div className={styles.normal}>
        <WingBlank>
          <Button>default</Button><WhiteSpace />
        </WingBlank>
        <ul className={styles.list}>
          <li><Link to="/">home</Link></li>
        </ul>
      </div>
    </Layout>
  );
}

Product.propTypes = {
};

export default connect()(Product);
