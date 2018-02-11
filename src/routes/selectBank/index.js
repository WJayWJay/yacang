import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { List,Flex } from 'antd-mobile';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';

import styles from './index.less';

const Item = List.Item;

const Brief = Item.Brief;


class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: '',
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
    console.log(item, 'aa')
    const {dispatch} = this.props;
    dispatch({
      type: 'trade/updateTradeInfo',
      payload: {bankCardID: item.bankCard, phoneNumber: item.phoneNumber}
    });
    dispatch({
      type: 'trade/updateCreditInfo',
      payload: {...item}
    });
    dispatch(routerRedux.push({
      pathname: '/reposit'
    }))
  }

  render() {
    return (
      <Layout title={'我的'}>
        <div className={styles.normal}>
        <List renderHeader={() => '选择消费信用卡'} className="my-list">
          {this.props.cardList.length ?
            this.props.cardList.map((item) => {
              return (<Item
                key={item.settleType}
                className={styles.listItem}
                extra={''}
                arrow='horizontal'
                multipleLine onClick={() => {this.selected(item)}}>
                {item.bankName || ''}
                <Brief>{item.bankCard || ''}</Brief>
              </Item>)
            })
            : 
            <Flex.Item align='center' style={{padding: '10px'}}>暂无绑定信用卡，<Link to={'/addBankCard'}>点击添加</Link></Flex.Item>
          }
        </List>

        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
  cardList: PropTypes.array
};
function mapStateToProps( state ) {
  // console.log(state,'select')
  const { isLogin, info } = state.user

  let cards = state.card.cardList;
  cards = Array.isArray(cards) ? cards.filter(item => item && item.bankCardType === '信用卡') : [];
  return {
    isLogin, 
    info, 
    cardList: cards
  }
}
export default connect( mapStateToProps )(Index);

