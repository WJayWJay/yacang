import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { routerRedux } from 'dva/router';
import { WhiteSpace, Flex, ActionSheet } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';
import Item from '../../components/item';
import Spinner from '../../components/Spinner';

import styles from './index.less';
import Constant from '../../constant';



class CardCenter extends React.Component {
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

  toAddCard = () => {
    // const BUTTONS = ['添加信用卡', '添加借记卡', 'Delete', '取消'];
    const BUTTONS = ['添加信用卡', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      // destructiveButtonIndex: BUTTONS.length - 2,
      // title: 'title',
      message: '请选择',
      maskClosable: true,
      'data-seed': 'logId',
      // wrapProps,
    },
    (buttonIndex) => {
      console.log(buttonIndex)
      if(buttonIndex === 0) {
        this.props.dispatch(routerRedux.push({
          pathname: '/addBankCard',
        }));
        return;
      } 
      // else if(buttonIndex === 1) {
      //   this.props.dispatch(routerRedux.push({
      //     pathname: '/addDebit',
      //   }));
      //   return;
      // } 
      else {
        console.log('cancel');
      }
    });
  }

  toCardDetail = (item) => {
    item.id && this.props.dispatch(routerRedux.push({
      pathname: '/cardDetail/'+ item.id
    }))
  }

  renderCard(item) {
    item = item || {};
    return (
      <Item key={(item.bankCard + item.id) || Date.now()} className={styles.column}>
        <Flex direction={'column'}>
          <WhiteSpace style={{height: '32px', width: '100%'}} />
          <Flex className={[styles.flex]} onClick={() => this.toCardDetail(item)}>
            <Item flex={1}>
              <img style={{width: '45px', height: '48px', borderRadius: '23px'}} alt="" src={Constant.banks[item.bankCode]} />
            </Item>
            <Item className={styles.titleInfo} flex={4}>
              <Flex align={'start'} direction={'column'}>
                <Item><span className={styles.title}>{item.bankName || ''}</span></Item>
                <Item><span>{item.bankCardType || ''}</span></Item>
              </Flex>
            </Item>
          </Flex>
          <WhiteSpace style={{height: '11px', width: '100%'}} />
          <Flex className={styles.flex}>
            <Item flex={1}>
              
            </Item>
            <Item className={styles.cardId} flex={4}>
              <span>{item.bankCard || ''}</span>
            </Item>
          </Flex>

          <WhiteSpace style={{height: '30px', width: '100%'}} />
          <Flex className={styles.flex}>
            <Item flex={1}>
              设置还款提醒
            </Item>
            <Item flex={1} style={{'textAlign': 'right'}}>
              <span className={styles.nowBack}>立即还款</span>
            </Item>
          </Flex>
        </Flex>
      </Item>
    )
  }
  
  render() {
    const { cardList } = this.props;
    let hasCard = Array.isArray(cardList) && cardList.length > 0;
    
    console.log(this.props.loading)
    return (
      <Layout title={'卡中心'}>
        <Spinner loading={this.props.loading} />
        <div className={styles.normal}>   
          <div className={styles.content}>
            <Flex direction={'column'} >
              <WhiteSpace style={{height: '20px', width: '100%'}} />
              
              {hasCard ?
                cardList.map(item => this.renderCard(item))
                :
                !this.props.loading ? (<Item>您还未绑定任何卡！</Item>) : null
              }

              <WhiteSpace style={{height: '100px', width: '100%'}} />
            </Flex>

          </div>
          
          <Button onClick={this.toAddCard} className={styles.addButton}>添加新卡</Button>
        </div>
      </Layout>
    );
  }
}

CardCenter.propTypes = {
};

function mapStateToProps(state) {
  const { info } = state.user;

  return {
    info,
    loading: state.loading.global || false,
    cardList: state.card.cardList
  }
}

export default connect(mapStateToProps)(CardCenter);
