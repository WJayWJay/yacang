import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Flex, List, InputItem, WhiteSpace, Toast } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

import logo from '../../assets/login-logo.png';

const Item = List.Item;

class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: ''
  }
  
  componentDidMount() {
    
  }
  componentWillUnmount() {
    
  }

  
  
  
  render() {

    const iconSize = '24px';
    return (
      <Layout title={'成员管理'}>
        <div className={styles.normal}>   
          <div className={styles.content}> 
            <Flex justify="center" className={styles.availableMoney}>
              <Flex direction='column'>
                <Flex className={styles.money}>
                  34560.00
                </Flex>
                <Flex className={styles.moneyDesc}>
                  可分利润额（元）
                </Flex>
              </Flex>
            </Flex>

            <List renderHeader={() => '我的好友（4人）'} className="my-list">
              <Item 
              className={styles.listItem}
              thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
              extra='2017年12月25日'
              multipleLine onClick={() => {}}>
                杨望洋 
              </Item>

              <Item
              className={styles.listItem}
              thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
              extra='2017年12月25日'
              multipleLine onClick={() => {}}>
                杨望洋 
              </Item>

              <Item
              className={styles.listItem}
              thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
              extra='2017年12月25日'
              multipleLine onClick={() => {}}>
                杨望洋 
              </Item>
            </List>
            
            <Flex className={styles.inviteContainer}>
              <Button className={styles.invite}>
              立即邀请
              </Button>
            </Flex>
            
          </div>
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
};
function mapStateToProps( state ) {
  // console.log(state)
  const { isLogin, codeSend: isSend } = state.user
  return {
    isLogin, isSend
  }
}
export default connect( mapStateToProps )(Index);
