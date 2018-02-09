import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Flex, List, InputItem, WhiteSpace, Toast } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

import logo from '../../assets/login-logo.png';
import headIcon from '../../assets/tx.png';
import ewmIcon from '../../assets/ewm.png';

class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: '',
  }



  render() {
    const { info } = this.props;
    const userInfo = Object.assign({}, info);

    return (
      <Layout title={'立即邀请'}>
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0,background: '#57493F', marginTop:'45px' }} >
        <div className={styles.normal}>
          <div className={styles.content}>
            <Flex className={styles.coloumn1} >
              <Flex className={styles.headContainer}>
                <img src={headIcon} alt="logo" style={{width: '56px', height: '56px'}} />
              </Flex>
              <Flex direction='column'>
                <Flex style={{flex: 1, width: '100%'}}>
                姓名：{ userInfo.customerName || userInfo.companyPhone || '' }
                </Flex>
                <Flex style={{flex: 1, width: '100%'}}>
                I   D：{ userInfo.customerNo || '' }
                </Flex>
              </Flex>
            </Flex>
            <Flex justify="center">
              <img src={ewmIcon} alt="logo" style={{width: '80%', height: '80%'}} />
            </Flex>
            <WhiteSpace style={{height: '20px'}} />
            <Flex justify="center" className={styles.last}>
              我的邀请码：{ userInfo.invitationCode || '' }
            </Flex>
          </div>
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
  const { isLogin, info } = state.user
  return {
    isLogin, info
  }
}
export default connect( mapStateToProps )(Index);
