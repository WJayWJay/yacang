import React from 'react';
import { connect } from 'dva';
import { Flex, WhiteSpace } from 'antd-mobile';

import * as qr from 'qr-image';

import Layout from '../../components/layout';

import styles from './index.less';

import headIcon from '../../assets/tx.png';
import ewmIcon from '../../assets/share/ewm.png';

class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: '',
  }



  render() {
    const { info } = this.props;
    const userInfo = Object.assign({}, info);
    let svg = '';
    if(userInfo.invitationCode) {
      const loc = window.location;
      let url = loc.protocol + '//' + loc.host + loc.pathname + '#/register?invite=' + userInfo.invitationCode;
      svg = qr.imageSync(url, {type: 'svg'});
    }
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
                { userInfo.customerName || userInfo.companyPhone || '' }
                </Flex>
                {/* <Flex style={{flex: 1, width: '100%'}}>
                I   D：{ userInfo.customerNo || '' }
                </Flex> */}
                {/* {svg} */}
              </Flex>
            </Flex>
            <Flex justify="center">
              {svg ? <div className={styles.svgCon} dangerouslySetInnerHTML={{__html: svg}}></div>:<img src={ewmIcon} alt="logo" style={{width: '80%', height: '80%'}} />}
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
