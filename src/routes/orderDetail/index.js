import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { List, WhiteSpace, Flex } from 'antd-mobile';
import pathToRegexp from 'path-to-regexp';

import PropTypes from 'prop-types';

import Layout from '../../components/layout';

import styles from './index.less';

const Item = List.Item;

class CardCenter extends React.Component {
  state = {
    hasError: false,
    value: '',
  }

  componentDidMount() {
    const { location } = this.props;
    console.log(this.props, 'hhhhh')

    const re = pathToRegexp('/orderDetail/:id');
    const match = re.exec(location.pathname);
    if ( Array.isArray(match) ) {
      let id = match[1]; 
      this.props.dispatch({
        type: 'trade/orderDetail',
        payload: {orderNo: id}
      });
    }
  }

  render() {
    const { isLogin, detail } = this.props;

    if(!detail || !detail.orderNo) {
      return (<Flex align='center' justify='center'><Flex.Item style={{textAlign: 'center', padding: '15px'}}>无相关订单信息</Flex.Item></Flex>)
    }

    const stat = {
      'FAIL': '支付失败',
      'UNCONFIRMED': '已受理',
      'SUCCESS': '支付成功',
    };
    const statColors = {
      'FAIL': '#FF4343',
      'UNCONFIRMED': '#3D67F7',
      'SUCCESS': '#8A8A9D',
    };
    return (
      <Layout title={'个人信息'}>
        <div className={styles.normal}>
          <div className={styles.content}>
            <Flex direction='column' style={{ width: '100%', background: '#ffffff'}}>
              <Flex.Item style={{ padding: '15px 10px', color: '#16153A', opacity: '0.6'}}>
                {detail.payTime || ''}
              </Flex.Item>
              <Flex.Item style={{ fontSize: '36px', color: '#FF5050', padding: '10px 10px', marginLeft: '0'}}>
               {'¥' + (detail.payMoney || '')}
              </Flex.Item>
              <Flex.Item style={{ padding: '10px 10px 15px', marginLeft: '0', color: statColors[detail.orderStat]}}>
              {stat[detail.orderStat] || ''}
              </Flex.Item>
            </Flex>
            <List className={styles.myList}>
              <Item extra={ (detail.payBankName || '') + `(${detail.payBankCard})` || ''}>信用卡</Item>
              <Item extra={ (detail.intoBankName || '') + `(${detail.intoBankCard})`}>储蓄卡</Item>
              <Item extra={ detail.orderNo || ''}>提现订单号</Item>
              <Item extra={ detail.payFee || ''}>提现服务费</Item>
              <Item extra={ detail.settleFee || ''}>到账服务费</Item>
              <Item extra={ detail.couponFee || ''}>优惠券抵扣</Item>
            </List>
            <WhiteSpace />
            <List>
              <Item extra={ detail.totalFee || ''}>合计</Item>
              <Item extra={ detail.payMoney || ''}>实际支付金额</Item>
            </List>
          </div>

        </div>
      </Layout>
    );
  }
}

CardCenter.propTypes = {
  detail: PropTypes.object
};

function mapStateToProps( state ) {
  const { isLogin } = state.user
  return {
    isLogin, detail: state.trade.tradeList.orderDetail
  }
}


export default connect(mapStateToProps)(CardCenter);
