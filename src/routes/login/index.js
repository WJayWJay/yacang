import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Flex, List, InputItem, Icon, WhiteSpace } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

import logo from '../../assets/login-logo.png';

class Index extends React.Component {
  state = {
    hasError: false,
    value: '',
  }
  
  render() {
    
    return (
      <Layout title={'登录'}>
        <div className={styles.normal}>   
          <div className={styles.content}> 
            <Flex justify="center" className={styles.logo}>
              <img src={logo} alt="logo" style={{width: '110px', height: '110px'}} />
            </Flex>
            <Flex direction="column">
              <List className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.4}}  
                  labelNumber={2}
                  placeholder="请输入手机号"
                  ref={el => this.autoFocusInst = el}
                ><Icon type='check-circle-o' /></InputItem>
              </List>
              <WhiteSpace />
              <List className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.4}}  
                  extra={<div className={styles.getCheckCode}>获取验证码</div>}
                  labelNumber={2}
                  placeholder="请输入验证码"
                ><Icon type='check-circle-o' /></InputItem>
              </List>
              <List className={styles.myList}>
                <Button className={styles.deleteButton}>登录</Button>
              </List>
            </Flex>
            
            <Flex className={styles.register} align="center" justify="center">
              <Flex.Item>
                新用户注册
              </Flex.Item>
            </Flex>
            
            <Flex className={styles.copyright} direction="column">
              <Flex.Item>
                广州雅藏文化传播有限公司 
              </Flex.Item>
              <Flex.Item>
                Copyright@2015～2035
              </Flex.Item>
            </Flex>
          </div>
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
};

export default connect()(Index);
