import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { List } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

const Item = List.Item;

class CardCenter extends React.Component {
  state = {
    hasError: false,
    value: '',
  }
  
  render() {
    
    return (
      <Layout title={'个人信息'}>
        <div className={styles.normal}>   
          <div className={styles.content}> 
            <List className={styles.myList}>
              <Item extra={'谭雅藏'}>姓名</Item>
              <Item extra={'3****************4'}>身份证</Item>
              <Item extra={'186*****4525'}>手机号码</Item>
            </List>
            <List renderHeader={() => '账户状态'} className={styles.myList}>
              <Item extra="已实名" arrow="horizontal" onClick={() => {}}>账户状态</Item>
              <Item extra="3张" arrow="horizontal" onClick={() => {}}>我的银行卡</Item>
              <Item extra="" arrow="horizontal" onClick={() => {}}>修改支付密码</Item>
            </List>
          </div>
          
          <Button className={styles.deleteButton}>注销账户</Button>
        </div>
      </Layout>
    );
  }
}

CardCenter.propTypes = {
};

export default connect()(CardCenter);
