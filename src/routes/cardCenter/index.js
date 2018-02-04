import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { routerRedux } from 'dva/router';
import { WhiteSpace, Flex, ActionSheet } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';
import Item from '../../components/item';

import styles from './index.less';

const ccbLogo = 'data:image/jpeg;base64,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FFABRRRQAUUUlAC0lFFABRRRQAUlFFABRRSUAFFFFABmkoooAKTNFFABSUUUwCkoooEFNZVcFWAIPUEUtFAGXc+HNEuyTPpNk7H+IwLn88ZrNl+H/haYktpKD/ckdf5GulorSNapHaT+8zlRpy3ivuOQb4Z+F26Wcq/Sd/8AGkHwz8MA/wDHpKfYzt/jXX0Vf1mt/O/vI+rUf5F9xy8Xw78LREH+ywx/2ppD/wCzVoQeFPD9rjytHssjoWhDEfic1r0VLrVZbyf3lKjSjtFfcMihigTZDEkaj+FFAFPopKyNQoopKAFpKKSgBaSikzQAtJRSUwFpKKKBBSUUUAFFFJQAtJRRQAUUlFABRRmkoAKKKKACikooAKKKKACiiigDVoooqSgooooAKKKSgAooooAKKKSgAooooAKKSigAoopKACiikoAWkopKAFpKKKYhKKKSgAoopKACiikoAWkoooAKSiigApKKKACikooAKKSigAozRmkoAKKM0lMQUUUlAC0lFFABRRSUAFFFGaACkoooAKKSigAooooAKSiigAoopKAFpKKKACiiigDWoooqSgpKKKACiiigAopKKACiikoAWkoooAKSiigAozSUUAFFJRTAKKSigQUUlFABRmkooAKKSigAoopKACiikoAWkoooAKSiigApKKM0AFJRRTAKSiigQUUlFABRRRQAUlFFABRRSUAFFFJQAtJRRQAUUUlABRRRQAUUUlABRRRQAUUUUAFFFFAGtmkooqSgooozQAUlFFABRRSUAFFFJQAtJRRQAUlFFABSUUZpgFJRRQIKSijNABSUUUAFJRRQAUZpKKACijNJQAUUUlABRRSUALSUUlAC0lFJTAKKKKBBSUUUAFFFJQAuaSiigApKKKACikNFABRRRQAUlFFABRRRQAUlFFABRRRQAUUUUAFFFFABRRRQBq0UUlSUFFFFABSUUUAFFFJQAUUUlABRRSUwFpKKSgQtJRSUAFFFJQAUUUlABRRRmgApKKKACkoooAKTNFFABRSUUAFFJRQAUUUlMAoopKBBmiiigAoopKACiikoAWkoooAKTNFFABRRSZoAWkoooAKKKSgBaSiigAooooAKKKKACiiigAooooAKKKKANSiiipKCkoooAKQ0UUAFFFFACUUUUAJRRRTEJQaKKAEoNFFACUUUUAJRRRQAGkoooAKSiigApKKKACkNFFABSUUUAFJRRTAKKKKBCUUUUAFBoooASiiigANJRRQAUlFFABRRRQAlFFFABRRRQAlFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/9k='

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
    const BUTTONS = ['添加信用卡', '添加借记卡', '取消'];
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
      } else if(buttonIndex === 1) {
        this.props.dispatch(routerRedux.push({
          pathname: '/addDebit',
        }));
        return;
      } else {
        console.log('cancel');
      }
    });
  }

  renderCard(item) {
    item = item || {};
    return (
      <Item className={styles.column}>
        <Flex direction={'column'}>
          <WhiteSpace style={{height: '32px', width: '100%'}} />
          <Flex className={[styles.flex]}>
            <Item flex={1}>
              <img style={{width: '45px', height: '48px', borderRadius: '23px'}} alt="" src={ccbLogo} />
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
    
    return (
      <Layout title={'卡中心'}>
        <div className={styles.normal}>   
          <div className={styles.content}>
            <Flex direction={'column'} >
              <WhiteSpace style={{height: '20px', width: '100%'}} />
              
              {hasCard ?
                cardList.map(item => this.renderCard(item))
                :
                (<Item>您还未绑定任何卡！</Item>)
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
    cardList: state.card.cardList
  }
}

export default connect(mapStateToProps)(CardCenter);
