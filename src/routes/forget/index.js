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
      <Layout title={'忘记密码'}>
        <div className={styles.normal}>   
          <div className={styles.content}> 
            <Flex direction="column">
              <List renderHeader={() => '为保证您的账户安全，请完成身份'} className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.5}} 
                  placeholder="请输入真实姓名"
                  ref={el => this.autoFocusInst = el}
                >姓名</InputItem>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.5}}
                  placeholder="请输入身份证号"
                >身份证</InputItem>
              </List>
              <List style={{marginTop: '11px'}} className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.5}} 
                  placeholder="186****5543"
                >手机号码</InputItem>
                <InputItem
                  clear
                  type="number"
                  maxLength={6}
                  extra={<div className={styles.getCheckCode}>获取验证码</div>}
                  style={{fontSize: '16px',opacity: 0.5}} 
                  placeholder="请输入验证码"
                >验证码</InputItem>
              </List>
            </Flex>
            
            <Button className={styles.saveButton}>保存</Button>
          </div>
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
};

export default connect()(Index);
