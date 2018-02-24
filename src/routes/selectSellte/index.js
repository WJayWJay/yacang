import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { List, } from 'antd-mobile';

import Layout from '../../components/layout';

import styles from './index.less';


const Item = List.Item;
const Brief = Item.Brief;


class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: '',
    fullScreen: true,
    selectedTab: 'greenTab'
  }


  componentDidMount() {
    this.props.dispatch({
      type: 'trade/getSellteType',
      payload: {}
    });
  }

  toTabLink = (link) => {
    this.props.history.push(link);
  }

  selected = (item) => {
    console.log(item, 'aa')
    const {dispatch} = this.props;
    dispatch({
      type: 'trade/updateTradeInfo',
      payload: {settleType: item.settleType}
    });
    dispatch(routerRedux.push({
      pathname: '/reposit'
    }))
  }

  render() {
    const sTypes = {
      'T0_INTEGRAL': '0.01%',
      'T0_NOINTEGRAL': '0.015%',
      'T1_INTEGRAL': '0.015%',
      'T1_NOINTEGRAL': '0.015%',
    };
    return (
      <Layout title={'我的'}>
        <div className={styles.normal}>
        <List renderHeader={() => '选择到账方式'} className="my-list">
          {
            this.props.sellteType.map((item) => {
              return (<Item
                key={item.settleType}
                className={styles.listItem}
                extra={''}
                arrow='horizontal'
                multipleLine onClick={() => {this.selected(item)}}>
                {item.settleTypeDsc || ''}
                <Brief>提现手续费  {sTypes[item.settleType] || ''}</Brief>
              </Item>)
            })
          }
        </List>

        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
};
function mapStateToProps( state ) {
  console.log(state,'select')
  const { isLogin, info } = state.user
  return {
    isLogin, 
    info, 
    sellteType: state.trade.sellteType || []
  }
}
export default connect( mapStateToProps )(Index);

