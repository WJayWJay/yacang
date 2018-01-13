import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Flex, List, InputItem, Icon, WhiteSpace } from 'antd-mobile';

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
      <Layout title={'用户注册'}>
        <div className={styles.normal}>   
          <div className={styles.content}> 
            <Flex direction="column">
              <List className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.4}}  
                  labelNumber={2}
                  placeholder="请输入邀请码"
                  ref={el => this.autoFocusInst = el}
                ><Icon type='check-circle-o' /></InputItem>
              </List>
              <WhiteSpace />
              <List className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.4}}  
                  labelNumber={2}
                  placeholder="请输入手机号"
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
                <Button className={styles.deleteButton}>完成注册</Button>
              </List>
            </Flex>
            
            <Flex justify="center" style={{marginTop: '150px', marginBottom: '38px', fontSize: '14px'}}>
                <Icon type="check-circle-o" color={'#8C8C9E'} size={'xs'} />
                <span className={styles.agree} >点击立即注册，即代表同意</span>
                <span className={styles.agreeUserProto} >《 用户协议 》</span>
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
