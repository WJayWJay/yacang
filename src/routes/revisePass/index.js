import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Flex, List, InputItem } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';


class Index extends React.Component {
  state = {
    hasError: false,
    value: '',
  }
  
  render() {
    
    return (
      <Layout title={'修改支付密码'}>
        <div className={styles.normal}>   
          <div className={styles.content}> 
            <Flex direction="column">
              <List renderHeader={() => '为保证您的账户安全，请完成验证'} className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.5, color: '#16153A'}} 
                  placeholder="请输入旧支付密码"
                  ref={el => this.autoFocusInst = el}
                >旧密码</InputItem>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.5, color: '#16153A'}}
                  placeholder="请输入新支付密码"
                >新密码</InputItem>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.5, color: '#16153A'}}
                  placeholder="请再次输入新支付密码"
                >确认密码</InputItem>
              </List>
            </Flex>
            
            <Button className={styles.saveButton}>完成修改</Button>
          </div>
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
};

export default connect()(Index);
