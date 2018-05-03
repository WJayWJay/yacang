import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { List, WhiteSpace, Flex } from 'antd-mobile';
import pathToRegexp from 'path-to-regexp';

import PropTypes from 'prop-types';

import Layout from '../../components/layout';
import { toDecimal2 } from '../../functions'

import styles from './index.less';
import Constant from '../../constant';


const Item = List.Item;

class CardCenter extends React.Component {
  state = {
    hasError: false,
    value: '',
  }

  componentDidMount() {
    const { location } = this.props;
    // console.log(this.props, 'hhhhh')

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

    // const stat = {
    //   'FAIL': '支付失败',
    //   'UNCONFIRMED': '已受理',
    //   'SUCCESS': '支付成功',
    // };
    const statColors = {
      '支付失败': '#3D67F7',
      '已受理': '#FF4343',
      '支付成功': '#8A8A9D',
    };
    return (
      <Layout title={'交易详情'}>
        <div className={styles.normal}>
          <div className={styles.content}>
            <Flex direction='column' style={{ width: '100%', background: '#ffffff'}}>
              <Flex.Item style={{ padding: '15px 10px', color: '#16153A', opacity: '0.6'}}>
                {detail.payTime || ''}
              </Flex.Item>
              <Flex.Item style={{ fontSize: '36px', color: '#FF5050', padding: '10px 10px', marginLeft: '0'}}>
               {'¥' + toDecimal2((detail.payMoney | 0) /100)}元
              </Flex.Item>
              <Flex.Item style={{ padding: '10px 10px 15px', marginLeft: '0', color: statColors[detail.orderStat]}}>
              {detail.orderStat || ''}
              </Flex.Item>
            </Flex>
            <List className={styles.myList}>
              <Item extra={ <div className={styles.containImg}><img style={{width: '20px', height: '20px'}} src={Constant.banks[detail.payBankCode]}  alt={detail.payBankName} />{(detail.payBankName || '') + `(${detail.payBankCard})` || ''} </div>}>信用卡</Item>
              <Item extra={  <div className={styles.containImg}><img style={{width: '20px', height: '20px'}} src={Constant.banks[detail.intoBankCode]}  alt={detail.payBankName} />{(detail.intoBankName || '') + `(${detail.intoBankCard})` || ''} </div>}>储蓄卡</Item>
              <Item extra={ detail.orderNo || ''}>提现订单号</Item>
              <Item extra={ toDecimal2((detail.payFee | 0) /100) }>提现服务费</Item>
              <Item extra={ toDecimal2((detail.settleFee | 0) /100) }>到账服务费</Item>
              <Item extra={ toDecimal2((detail.couponFee | 0) /100) }>优惠券抵扣</Item>
            </List>
            <WhiteSpace />
            <List className={styles.myList}>
              <Item extra={ <span style={{color: 'red'}}> {toDecimal2((detail.totalFee | 0) /100)} </span>}>合计</Item>
              <Item extra={ <span style={{color: 'red'}}> {toDecimal2(((detail.payMoney - detail.totalFee) | 0) /100)} </span>}>实际到账金额</Item>
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
