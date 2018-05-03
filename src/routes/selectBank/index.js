import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { List, Flex, Modal } from 'antd-mobile';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';
import queryString from 'query-string';

import styles from './index.less';

const Item = List.Item;

const Brief = Item.Brief;


class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: '',
    loadAlert: true
  }


  componentDidMount() {
    this.props.dispatch({
      type: 'card/fetchCard',
      payload: {}
    });
  }

  toTabLink = (link) => {
    this.props.history.push(link);
  }

  selected = (item) => {
    // console.log(item, 'aa')
    const { dispatch } = this.props;
    dispatch({
      type: 'trade/updateTradeInfo',
      payload: { bankCardID: item.id, phoneNumber: item.phoneNumber }
    });
    dispatch({
      type: 'trade/updateCreditInfo',
      payload: { ...item }
    });
    // dispatch(routerRedux.push({
    //   pathname: '/reposit'
    // }))

    const { history } = this.props;
    let search = history.location.search;
    search = queryString.parse(search);
    let initialPage = search.type | 0;
    dispatch(routerRedux.push({
      pathname: '/reposit',
      search: queryString.stringify({ initialPage: initialPage })
    }))
  }

  onClose = () => {
    this.setState({loadAlert: false});
  }
  toBindCard = (link) => {
    this.props.dispatch(routerRedux.push({
      pathname: link
    }))
  }

  loadAlert = () => {
    return (<Modal
      visible={this.state.loadAlert}
      transparent
      maskClosable={false}
      onClose={this.onClose}
      title="绑卡提示"
      footer={[
        { text: '取消', onPress: () => { this.onClose() } },
        { text: '确定', onPress: () => { this.toBindCard('/addBankCard') } }
      ]}
      wrapProps={{ onTouchStart: this.onWrapTouchStart }}
    >
      <div style={{ overflow: 'scroll' }}>
        您还没绑定过信用卡，去绑定?
      </div>
    </Modal>)
  }

  render() {
    const { isLogin, loading } = this.props;
    const len = this.props.cardList.length || 0;
    return (
      <Layout title={'我的'}>
        <div className={styles.normal}>
          <List renderHeader={() => '选择消费信用卡'} className="my-list">
            {len ?
              this.props.cardList.map((item) => {
                return (<Item
                  key={item.id}
                  className={styles.listItem}
                  extra={''}
                  arrow='horizontal'
                  multipleLine onClick={() => { this.selected(item) }}>
                  {item.bankName || ''}
                  <Brief>{item.bankCard || ''}</Brief>
                </Item>)
              })
              :
              <Flex.Item align='center' style={{ padding: '10px' }}>暂无绑定信用卡，<Link to={'/addBankCard'}>点击添加</Link></Flex.Item>
            }
          </List>
          {isLogin && !loading && !len && this.loadAlert() || ''}
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
  cardList: PropTypes.array
};
function mapStateToProps(state) {
  // console.log(state,'select')
  const { isLogin, info } = state.user
  
  let cards = state.card.cardList;
  cards = Array.isArray(cards) ? cards.filter(item => item && item.bankCardType === '信用卡') : [];
  return {
    isLogin,
    info,
    loading: state.loading.global,
    cardList: cards
  }
}
export default connect(mapStateToProps)(Index);

