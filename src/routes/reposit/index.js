import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Flex, List, InputItem, Toast, Modal, TabBar, Tabs, Badge, WhiteSpace, Icon } from 'antd-mobile';
import { createForm } from 'rc-form';
import queryString from 'query-string';


import PropTypes from 'prop-types';

import Layout from '../../components/layout';
import Button from '../../components/button';
import Spinner from '../../components/Spinner';

import styles from './index.less';

import zhaoshangIcon from '../../assets/card/card-zhaoshang.png';
import jianhangIcon from '../../assets/card/card-jianhang.png';

const Item = List.Item;
const Brief = Item.Brief;

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

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

    inputTradePwd: false,
    password: '',

    selectPayType: 0,
    initialPage: 0,
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
      setTimeout(()=> {
        this.setState({
          inputTradePwd: false
        })
      },500);
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
    
    let err = this.checkError();
    if(!err) {
      return ;
    }

    this.props.dispatch({
      type: 'trade/queryPreArrivalAmount', // arrivalAmount
      payload: {}
    })

    this.showModal('inputTradePwd');
  }

  toGetCode = (value) => {

    this.setState({
      sendDisabled: true,
    });
    this.props.dispatch({
      type: 'trade/sendSmsCode',
      payload: {type: 'applyDualMsg'}
    });
    
  }

  onChange = (value) => {
    if(/^\d+$/.test(value)) {
      if(value.length === 6) {
        this.toGetCode(value);
      }
      this.props.dispatch({
        type: 'trade/updateTradeInfo',
        payload: {password: value},
      });
      this.setState({
        password: value
      })
    }
  }
  ModelItem = () => {
    const { tradeInfo, dispatch } = this.props;
    let payMoney = (tradeInfo.payMoney | 0) / 100;
    return (<Modal
      visible={this.state.inputTradePwd}
      transparent
      closable={true}
      maskClosable={false}
      onClose={this.onClose('inputTradePwd')}
      title="请输入支付密码"
      // footer={[{ text: 'Ok', onPress: () => { console.log('ok'); this.onClose('inputTradePwd')(); } }]}
      wrapProps={{ onTouchStart: this.onWrapTouchStart }}
    >
      <div>
        <div className={styles.mAdditional} >到账金额</div>
        <WhiteSpace />
        <div className={styles.moneyAlert}>{'¥'+ payMoney}</div>
        <WhiteSpace style={{height: '20px'}} />
        <div className={styles.moneyAddition}>额外扣除 <span>¥{this.props.arrivalAmount || 0}</span> 手续费</div>
        <WhiteSpace style={{height: '20px'}} />        
        <InputItem
          className={styles.myPwdInput}
          style={{border: '1px solid #979797', borderRadius: '6px', height: '50px', width: '100%', textIndent: '10px'}}
          type="password"
          maxLength={6}
          placeholder="请输入交易密码"
          error={this.state.hasError}
          onErrorClick={this.onErrorClick}
          onChange={this.onChange}
          value={this.state.password}
        />
        <WhiteSpace style={{height: '24px'}} />
        <div onClick={() => this.toLink('/forget')} style={{fontSize: '16px', color: '#646464', textAlign: 'center'}}>
        忘记密码？
        </div>
        <WhiteSpace style={{height: '20px'}} />
      </div>
    </Modal>);
  }

  checkError = () => {
    const { tradeInfo } = this.props;

    if(!tradeInfo.payMoney || isNaN(parseInt(tradeInfo.payMoney, 10))) {
      Toast.fail('消费金额填写错误！');
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
    return true;
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

    this.props.dispatch({
        type: 'trade/quickDual',
        payload: {}
    });
  }


  renderSelf = () => {
    const tabs = [
      { title: <Badge text={''}>无卡快捷</Badge> },
      { title: <Badge text={''}>跳转支付</Badge> },
    ];
    const { history } = this.props;
    let search = history.location.search;
    search = queryString.parse(search);
    console.log(search, 'ssss')
    let initialPage = search.initialPage | 0;
    console.log(initialPage, 'initialPage')
    
    initialPage = initialPage < 2? initialPage: 0;
    
    console.log(initialPage, 'ijiiiii')
    return (<Layout title={'提现'}>
      <Tabs tabs={tabs}
        initialPage={initialPage}
        onChange={(tab, index) => { console.log('onChange', index, tab); }}
        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
      >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'auto', backgroundColor: '#fff' }}>
        {this.renderTab()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'auto', backgroundColor: '#fff' }}>
        {this.renderLinkTab()}
      </div>
    </Tabs>
    </Layout>);
  }

  renderLinkTab = () => {
    const { getFieldProps, getFieldError } = this.props.form;
    const { tradeInfo } = this.props;
    let payMoney = tradeInfo.payMoney | 0;
    payMoney = payMoney / 100;
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
                  initialValue: payMoney || '',
                  normalize: (v, prev) => {
                    if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                      if (v === '.') {
                        return '0.';
                      }
                      return prev;
                    }
                    return v;
                  },
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
                clear
                error={!!getFieldError('payMoney')}
                type="digit"
                placeholder="请输入消费金额"
              ></InputItem>
            </List>
            <List renderHeader={() => '选择到账方式'} className="my-list">
              {this.renderSettle(1)}
            </List>
            <List renderHeader={() => '请选择支付方式'} className="my-list">
              {this.renderPayType()}
            </List>
            
            <Flex className={styles.inviteContainer}>
              <Button onClick={this.tosubmit} className={styles.invite}>
              立即消费
              </Button>
            </Flex>
          </div>
        </div>
      </div>
    )
  }

  tosubmit = () => {
    const { tradeInfo, dispatch, paySelectType: selectPayType } = this.props;
    if(!selectPayType) {
      Toast.fail('请选择支付方式！');
      return;
    } else if(selectPayType === 1) {
      Toast.fail('支付宝支付方式暂未开通！');
      return;
    } else if(selectPayType === 2) {
      Toast.fail('微信支付方式暂未开通！');
      return;
    }
    if(!tradeInfo.payMoney || isNaN(parseFloat(tradeInfo.payMoney, 10))) {
      Toast.fail('消费金额填写错误！');
      return;
    }

    if(!tradeInfo.settleType) {
      Toast.fail('请选择到账方式！');
      return;
    }
    this.props.dispatch({
      type: 'trade/cashierDesk',
      payload: {}
    });
  }


  selectPayType = (item) => {
    console.log('select')
    if( !item || !item.type) return;
    this.props.dispatch({
      type: 'trade/updateState',
      payload: {paySelectType: item.type}
    });
  }

  renderPayType = () => {
    let items = [
      {title: '支付宝', type: 1, src: require('../../assets/reposit/syt_zfb.png')},
      {title: '微信支付', type: 2, src: require('../../assets/reposit/syt_wx.png')},
      {title: '其他支付', type: 3, src: require('../../assets/reposit/syt_qtzf.png')},
    ];
    let selectPayType = this.props.paySelectType;
    return (items.map(item =><Item
      className={styles.listItem}
      key={item.title}
      extra={<Icon color={selectPayType === item.type ? '#00B402': '#565656'} type={selectPayType === item.type ? 'check-circle':'check-circle-o'} />}
      // thumb={<img className={styles.listItemIcon} src={item.src} alt="zhaoshang" />}
      multipleLine 
      onClick={() =>this.selectPayType(item)}>
        <img style={{ width: '124px', height: '50px'}} src={item.src} alt={item.title} />
    </Item>))
  }




  toLink = (link, params) => {
    if(link) {
      let search = params ? '?'+queryString.stringify(params): '';
      this.props.dispatch(routerRedux.push({
        pathname: link,
        search: search
      }))
    }
  }

  renderSettle = (type) => {
    const { tradeInfo } = this.props;
    let settleType = tradeInfo.settleType || '';
    if(!settleType) {
      return (
        <Item
          className={styles.listItem}
          extra={''}
          arrow='horizontal'
          multipleLine
          onClick={this.toLink.bind(this, '/selectSellte', {type: type})}>
            选择到账方式
        </Item>
      );
    }
    const sTypes = {
      'T0_INTEGRAL': '0.01%',
      'T0_NOINTEGRAL': '0.015%',
      'T1_INTEGRAL': '0.015%',
      'T1_NOINTEGRAL': '0.015%',
    };
    return this.props.sellteType.filter(item => item.settleType === settleType)
    .map(ritem => {
      return (
        <Item
          key={ritem.settleType}
          className={styles.listItem}
          extra={''}
          arrow='horizontal'
          multipleLine
          onClick={this.toLink.bind(this, '/selectSellte', {type: type})}>
            {ritem.settleTypeDsc || ''}<Brief>提现手续费  {sTypes[settleType] || ''}</Brief>
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
    let payMoney = tradeInfo.payMoney | 0;
    payMoney = payMoney / 100;
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
                  initialValue: payMoney || '',
                  normalize: (v, prev) => {
                    if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                      if (v === '.') {
                        return '0.';
                      }
                      return prev;
                    }
                    return v;
                  },
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
                clear
                error={!!getFieldError('payMoney')}
                type="digit"
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
              {this.renderSettle(0)}
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

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  showModal = key => {
    this.setState({
      [key]: true,
    });
    this.setState({
      password: ''
    })
  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    });
    this.setState({
      password: ''
    })
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

        {this.ModelItem()}
      </div>
    );
  }
}

Index.propTypes = {
  tradeInfo: PropTypes.object
};

function mul(x) {
  let s = '' + x;
  if(s.indexOf('.') === -1) return (x|0) * 100;
  let arr = s.split('.');
  let first = parseInt(arr[0], 10) * 100;
  if(!arr[1]) return first;
  let second = arr[1].substr(0, 2);
  second = second.length === 2? parseInt(second, 10): (second | 0) * 10;
  return first + second;
}

const RepositIndex = createForm({
  onValuesChange(props, value) {
    if(value && value.payMoney) {
      let money = parseFloat(value.payMoney);
      money = mul(money) | 0;
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
    cardList: cards,
    arrivalAmount: state.trade.arrivalAmount,
    paySelectType: state.trade.paySelectType
  }
}
export default connect( mapStateToProps )(RepositIndex);
