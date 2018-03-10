import React from 'react';
import { NavBar, Icon } from 'antd-mobile'

import styles from './layout.less'

const Layout = (props) => {
  let hidden = props.hidden || false;
  if(navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1) {
    hidden = true;
  }
  document.title = props.title || '汇藏';
  return (
    <div className={styles.layContainer}>
      {!hidden ?<NavBar
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
