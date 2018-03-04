import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { List, } from 'antd-mobile';
import queryString from 'query-string';

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
    const {dispatch} = this.props;
    dispatch({
      type: 'trade/updateTradeInfo',
      payload: {settleType: item.settleType}
    });
    const { history } = this.props;
    let search = history.location.search;
    search = queryString.parse(search);
    let initialPage = search.type | 0;
    dispatch(routerRedux.push({
      pathname: '/reposit',
      search: queryString.stringify({initialPage: initialPage})
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
  const { isLogin, info } = state.user
  return {
    isLogin, 
    info, 
    sellteType: state.trade.sellteType || []
  }
}
export default connect( mapStateToProps )(Index);

