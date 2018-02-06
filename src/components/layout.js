import React from 'react';
import { NavBar, Icon } from 'antd-mobile'

import styles from './layout.less'

const Layout = (props) => {
  return (
    <div className={styles.layContainer}>
      {!props.hidden ?<NavBar
        mode="light"
        onLeftClick={() => props.back? props.back(): window.history.back()}
        icon={<Icon type="left" />}
        rightContent={[
          <Icon key="0" type="ellipsis" />
        ]}
      >{props.title|| ''}</NavBar> : null}
        <div className={styles.view}>
          { props.children }
        </div>
    </div>
  );
};

Layout.propTypes = {

};

export default Layout;
