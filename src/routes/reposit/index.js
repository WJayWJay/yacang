import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Flex, List, InputItem, Toast, Modal, TabBar, Tabs, Badge, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';

import PropTypes from 'prop-types';

import Layout from '../../components/layout';
import Button from '../../components/button';
import Spinner from '../../components/Spinner';

import styles from './index.less';

import zhaoshangIcon from '../../assets/card/card-zhaoshang.png';
import jianhangIcon from '../../assets/card/card-jianhang.png';

const Item = List.Item;
const Brief = Item.Brief;
const prompt = Modal.prompt;


class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: '',
    selectedTab: 'redTab',
    fullScreen: true,
    smsInfo: '获取验证码',
    itime: 60,
    sendDisabled: false,
    agreeColor: '#8C8C9E',
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'trade/getSellteType',
      payload: {}
    });
    this.props.dispatch({
      type: 'card/fetchCard',
      payload: {}
    });
    
  }
  intervId = 0;

  componentWillUnmount() {
    this.intervId && clearInterval(this.intervId);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.tradeSmsSend, 'jjjjj')
    if(nextProps.tradeSmsSend === 0) {
      this.startInterv();
    } else {
      this.intervId && clearInterval(this.intervId);
      this.setState({
        sendDisabled: false
      })
    }
  }
  startInterv() {
    this.intervId = setInterval(() => {
      let time = this.state.itime;
      if(time < 1) {
        this.intervId && clearInterval(this.intervId);
        this.setState({
          smsInfo: '获取验证码',
          sendDisabled: false,
          itime: 60
        });
        this.props.dispatch({
          type: 'trade/updateState',
          payload: {tradeSmsSend: -1}
        });
        return;
      }
      this.setState({
        smsInfo: '获取验证码（'+time+'）'
      }, () => {
        this.setState({
          itime: --time
        })
      });
    }, 1000);
  }

  getCode = (e) => {
    e.preventDefault();
    const { getFieldError } = this.props.form;
    if(!!getFieldError('smsCode')) {
      Toast.show('验证码格式错误！');
      return;
    }
    this.setState({
      sendDisabled: true,
    });
    this.props.dispatch({
      type: 'trade/sendSmsCode',
      payload: {type: 'debit'}
    });
  }

  submit = (e) => {
    // check error
    // this.props.dispatch({
    //   type: 'trade/applyDualMsg'
    // })
    const { tradeInfo, dispatch } = this.props;

    if(!tradeInfo.payMoney || isNaN(parseInt(tradeInfo.payMoney, 10))) {
      Toast.fail('消费金额填写错误！');
      return;
    }
    if(!tradeInfo.smsCode || tradeInfo.smsCode.length < 4) {
      Toast.fail('短信验证码填写错误！');
      return;
    }
    if(!tradeInfo.settleType) {
      Toast.fail('请选择到账方式！');
      return;
    }
    if(!tradeInfo.bankCardID || tradeInfo.bankCardID.length < 10 || tradeInfo.phoneNumber < 6) {
      Toast.fail('请选择消费信用卡！');
      return;
    }


    prompt(
      '请输入支付密码',
      <div>
      <div className={styles.mAdditional} >到账金额</div>
      <WhiteSpace />
      <div className={styles.moneyAlert}>{'¥'+ (tradeInfo.payMoney / 100)}</div>
      <WhiteSpace style={{height: '20px'}} />
      <div className={styles.moneyAddition}>额外扣除 <span>¥0.10</span> 手续费</div>
      </div>,
      password => {
        dispatch({
          type: 'trade/updateTradeInfo',
          payload: {password: password}
        });
        setTimeout(() => {
          dispatch({
            type: 'trade/applyDualMsg',
            payload: {}
          })
        }, 100)
      },
      'secure-text',
    )
  }

  renderSelf = () => {
    const tabs = [
      { title: <Badge text={''}>无卡快捷</Badge> },
      { title: <Badge text={''}>跳转支付</Badge> },
    ];

    return (<Layout title={'提现'}>
      <Tabs tabs={tabs}
        initialPage={0}
        onChange={(tab, index) => { console.log('onChange', index, tab); }}
        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
      >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'auto', backgroundColor: '#fff' }}>
        {this.renderTab()}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'auto', backgroundColor: '#fff' }}>
        Content of second tab
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'auto', backgroundColor: '#fff' }}>
        Content of third tab
      </div>
    </Tabs>
    </Layout>);
  }

  toLink = (link) => {
    if(link) {
      this.props.dispatch(routerRedux.push({
        pathname: link
      }))
    }
  }

  renderSettle = () => {
    const { tradeInfo } = this.props;
    let settleType = tradeInfo.settleType || '';
    if(!settleType) {
      return (
        <Item
          className={styles.listItem}
          extra={''}
          arrow='horizontal'
          multipleLine
          onClick={this.toLink.bind(this, '/selectSellte')}>
            选择到账方式
        </Item>
      );
    }
    return this.props.sellteType.filter(item => item.settleType === settleType)
    .map(ritem => {
      return (
        <Item
          key={ritem.settleType}
          className={styles.listItem}
          extra={''}
          arrow='horizontal'
          multipleLine
          onClick={this.toLink.bind(this, '/selectSellte')}>
            {ritem.settleTypeDsc || ''}<Brief>提现手续费  0.015%</Brief>
        </Item>
      );
    });
  }

  selectBandCard = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/selectBank'
    }));
  }

  renderFromBank = () => {
    const { tradeInfo, creditInfo } = this.props;
    let bankCardID = tradeInfo.bankCardID || '';
    if(!bankCardID) {
      return (
        <Item
          className={styles.listItem}
          arrow='horizontal'
          multipleLine 
          onClick={this.selectBandCard}
        >
          请选择消费信用卡
        </Item>
      )
    }
    return (              
    <Item
      className={styles.listItem}
      thumb={<img className={styles.listItemIcon} src={zhaoshangIcon} alt="zhaoshang" />}
      arrow='horizontal'
      multipleLine onClick={this.selectBandCard}>
        {creditInfo && creditInfo.bankName || ''} <Brief>尾号{creditInfo && creditInfo.bankCard && creditInfo.bankCard.slice( creditInfo.bankCard.length - 4 ) || ''} 信用卡</Brief>
    </Item>)
  }
  renderRecieveBank = () => {
    const { cardList } = this.props;
    let cards = cardList.filter(item => item && item.bankCardType === '借记卡');
    if(!cards.length) {
      return (     
        <Item
          className={styles.listItem}
          arrow='horizontal'
          multipleLine 
          onClick={() => {}}
        >
          到账银行
        </Item>
      )
    }
    let card = cards[0];
    return (              
    <Item
      className={styles.listItem}
      thumb={<img className={styles.listItemIcon} src={zhaoshangIcon} alt="zhaoshang" />}
      arrow='horizontal'
      multipleLine onClick={() => {}}>
        {card.bankName || ''} <Brief>尾号{card && card.bankCard && card.bankCard.slice( card.bankCard.length - 4 ) || ''} 借记卡</Brief>
    </Item>)
  }

  renderTab = () => {
    const { getFieldProps, getFieldError } = this.props.form;
    const { tradeInfo } = this.props;
    
    return (
      <div style={{ width: '100%'}} title={'提现'}>
        <Spinner loading={this.props.loading} />
        <div className={styles.normal}>
          <div className={styles.content}>

            <List renderHeader={() => ''} className="my-list">
              <InputItem
                className={styles.inputMoney}
                moneyKeyboardAlign={'left'}
                {...getFieldProps('payMoney', {
                  initialValue: '',
                  rules: [{
                    required: true,
                    validator: (rule, value, cb) => {
                      if(value - 10 < 0) {
                        cb(new Error('提现金额10元以上！'))
                      } else {
                        cb();
                      }
                    }
                  }],
                })}
                error={!!getFieldError('payMoney')}
                type="money"
                placeholder="请输入消费金额"
              ></InputItem>
            </List>
            <List renderHeader={() => '消费信用卡'} className="my-list">
              {this.renderFromBank()}
              {/* <Item
              className={styles.listItem}
              thumb={<img className={styles.listItemIcon} src={zhaoshangIcon} alt="zhaoshang" />}
              arrow='horizontal'
              multipleLine onClick={() => {}}>
                招商银行 <Brief>尾号2528 信用卡</Brief>
              </Item> */}
            </List>
            <List renderHeader={() => '到账银行'} className="my-list">
              {this.renderRecieveBank()}
            </List>

            <List renderHeader={() => '选择到账方式'} className="my-list">
              {this.renderSettle()}
            </List>
            <List renderHeader={() => '到账银信用卡预留手机号' + (tradeInfo.phoneNumber ? tradeInfo.phoneNumber: '')} className="my-list">
              <InputItem
                type="number"
                {...getFieldProps('smsCode', {
                  initialValue: '',
                  rules: [{
                    required: true,
                    validator: (rule, value, cb) => {
                      value && value.length >3 && value.length <7 ? cb():cb(new Error('验证码格式错误'))
                    }
                  }],
                })}
                maxLength={6}
                placeholder="请输入验证码"
                error={!!getFieldError('smsCode')}
                extra={<Button
                        disabled={this.state.sendDisabled}
                        onClick={this.getCode}
                        inline
                        className={styles.getSmsCode}
                        type="primary">{this.state.smsInfo || ''}</Button>}
              >验证码</InputItem>
            </List>

            <Flex className={styles.inviteContainer}>
              <Button onClick={this.submit} className={styles.invite}>
              立即消费
              </Button>
            </Flex>

          </div>
        </div>
      </div>
    );
  }

  toTabLink = (link) => {
    this.props.history.push(link);
  }

  renderContent(pageText) {
    if(pageText === 'home') {
      // return this.props.history.push('/home');
    }
    if(pageText === 'reposit') {
      return this.renderSelf();
    }
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        {pageText}
      </div>
    )
  }

  render() {
    const iconSize = '26px';
    return (
      <div className={styles.contentContainer} style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="汇藏"
            key="汇藏"
            icon={<div style={{
              width: iconSize,
              height: iconSize,
              background: 'url(' + require('../../assets/tabbar/tab-sy-normal.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat'
            }}
            />
            }
            selectedIcon={<div style={{
              width: iconSize,
              height: iconSize,
              background: 'url(' + require('../../assets/tabbar/tab-sy-click.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}
            />
            }
            selected={this.state.selectedTab === 'blueTab'}
            // badge={1}
            onPress={() => {
              this.toTabLink('/home')
            }}
            data-seed="logId"
          >
            {this.renderContent('home')}
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: iconSize,
                height: iconSize,
                background: 'url(' + require('../../assets/tabbar/tab-tx-normal.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: iconSize,
                height: iconSize,
                background: 'url(' + require('../../assets/tabbar/tab-tx-click.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}
              />
            }
            title="收银台"
            key="收银台"
            // badge={'new'}
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              // this.toLink('/reposit')
              // this.toTabLink('/reposit')
            }}
            data-seed="logId1"
          >
            {this.renderContent('reposit')}
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: iconSize,
                height: iconSize,
                background: 'url(' + require('../../assets/tabbar/tab-wd-normal.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: iconSize,
                height: iconSize,
                background: 'url(' + require('../../assets/tabbar/tab-wd-click.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}
              />
            }
            title="我的"
            key="我的"
            // dot
            selected={this.state.selectedTab === 'greenTab'}
            onPress={() => {
              this.toTabLink('/myself')
            }}
          >
            {this.renderContent('myself')}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

Index.propTypes = {
  tradeInfo: PropTypes.object
};

const RepositIndex = createForm({
  onValuesChange(props, value) {
    console.log('onvalueChange...', value);
    if(value && value.payMoney) {
      let money = parseFloat(value.payMoney);
      money = money * 100 | 0;
      props.dispatch({
        type: 'trade/updateTradeInfo',
        payload: {payMoney: money},
      });
      return;
    }
    props.dispatch({
      type: 'trade/updateTradeInfo',
      payload: value,
    });
  },
})(Index);
function mapStateToProps( state ) {
  // console.log(state)
  const { isLogin } = state.user
  // console.log(state)
  let cards = state.card.cardList;
  cards = Array.isArray(cards) ? cards : [];
  return {
    isLogin,
    loading: state.loading.global || false,
    tradeSmsSend: state.trade.tradeSmsSend,
    tradeInfo: state.trade.tradeInfo || {},
    creditInfo: state.trade.creditInfo || {},
    sellteType: state.trade.sellteType || [],
    cardList: cards
  }
}
export default connect( mapStateToProps )(RepositIndex);
