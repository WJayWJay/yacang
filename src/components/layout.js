import React from 'react';
import { NavBar, Icon } from 'antd-mobile'

import styles from './layout.less'

const Layout = (props) => {
  return (
    <div>
      <NavBar
        mode="light"
        onLeftClick={() => props.back? props.back(): window.history.back()}
        icon={<Icon type="left" />}
        rightContent={[
          <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
          <Icon key="1" type="ellipsis" />,
        ]}
      >{props.title|| '雅藏'}</NavBar>
        <div className={styles.view}>
          { props.children }
        </div>
    </div>
  );
};

Layout.propTypes = {
};

export default Layout;
