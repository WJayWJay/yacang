import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { WhiteSpace, Flex, List } from 'antd-mobile';
import pathToRegexp from 'path-to-regexp';
import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

import Constant from '../../constant'


class CardDetail extends React.Component {
  state = {
    hasError: false,
    value: '',
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'card/fetchCard',
      payload: {}
    })
  }
  
  render() {
    const { location, cardList } = this.props;
    // console.log(this.props, 'hhhhh')
    let id = '';
    let cardDetail = {};
    const re = pathToRegexp('/cardDetail/:id');
    const match = re.exec(location.pathname);
    if ( Array.isArray(match) ) {
      id = match[1] | 0;
      cardDetail = cardList.filter(item => item.id && item.id === id)[0] || {};
    }
    return (
      <Layout title={'卡详情'}>
        <div className={styles.normal}>   
          <div className={styles.header}>
            <Flex direction={'column'} >
              <Flex.Item>
                <img style={{width: 90, height: 90}} alt="" src={Constant.banks[cardDetail.bankCode || 'un']} />
              </Flex.Item>
              <WhiteSpace style={{marginTop: '24px'}} />
              <Flex.Item >
                <div style={{color: '#756145',fontSize: '24px'}}>{cardDetail.bankName || ''}</div>
              </Flex.Item>
              <WhiteSpace style={{marginTop: '10px'}} />
              <Flex.Item>
                <div style={{color: '#756145',fontSize: '26px'}}>{cardDetail.bankCard || ''}</div>
              </Flex.Item>
              <WhiteSpace style={{marginTop: '60px'}} />
            </Flex>
          </div>
          <div className={styles.content}>
            <List renderHeader={() => <span className={styles.itemHeader} >银行卡支付限额</span>} className="my-list">
              <List.Item extra={<span style={{color: '#FF5050', fontSize: '16px'}}>¥50000</span>}>
                <span className={styles.itemTitle}>单笔限额</span>
              </List.Item>
              <List.Item extra={<span className={styles.itemExtra} >¥50000</span>}>
                <span className={styles.itemTitle}>每日限额</span>
              </List.Item>
            </List>
          </div>
          <Button className={styles.releaseButton}>解除绑定</Button>
        </div>
      </Layout>
    );
  }
}

CardDetail.propTypes = {
};

export default connect((state) => {
  const { info } = state.user;
  return {
    info,
    cardList: state.card.cardList || []
  }
})(CardDetail);
