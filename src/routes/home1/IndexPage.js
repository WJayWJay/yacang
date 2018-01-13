import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

import Layout from '../../components/layout'

import styles from './IndexPage.css';

function IndexPage(props) {
  console.log(props)
  return (
    <Layout>
      <div className={styles.normal}>
        <h1 className={styles.title}>Yay! Welcome to dva!</h1>
        <ul className={styles.list}>
          <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
          <li><Link to="/product">product</Link></li>
        </ul>
      </div>
    </Layout>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
