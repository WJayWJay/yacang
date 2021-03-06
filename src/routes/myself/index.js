import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Flex, List, WhiteSpace, NoticeBar, Modal, TabBar } from 'antd-mobile';

import Layout from '../../components/layout';

import styles from './index.less';

import headImageIcon from '../../assets/myself/wd-user.png';
import reviceMoneyIcon from '../../assets/myself/wd-wysk.png';
import cardCenterIcon from '../../assets/myself/wd-kzx.png';
import tradeRecordIcon from '../../assets/myself/wd-cjgl.png';

const Item = List.Item;
const alert = Modal.alert;

const tabsInfo= [
  {title: '我要收款', icon: reviceMoneyIcon},
  {title: '卡中心', icon: cardCenterIcon},
  {title: '成交记录', icon: tradeRecordIcon},
];
const listInfo= [
  {id: 'manager', title: '成员管理', icon: require('../../assets/myself/wd-cy.png') },
  {id: 'share', title: '推荐给好友', icon: require('../../assets/myself/wd-tj.png') },
  {id: 'about', title: '关于汇藏', icon: require('../../assets/myself/wd-gy.png') },
  // {id: 'feedback', title: '帮助反馈', icon: require('../../assets/myself/wd-bz.png') },
  {id: 'notice', title: '关注公众号', icon: require('../../assets/myself/wd-gz.png') },
  // {id: '', title: '申请信用卡', icon: require('../../assets/myself/wd-gy.png') },
  
]

class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: '',
    fullScreen: true,
    selectedTab: 'greenTab'
  }

  componentDidMount() {

  }
  componentWillUnmount() {
    if(this.intervId) {
      clearInterval(this.intervId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps !== this.props) {

    }
  }

  toLogin = () => {
    const { isLogin, dispatch } = this.props;
    if(isLogin) {
      this.props.history.push('/userinfo');
    } else {
      // console.log(encodeURIComponent(window.location.href))
      dispatch(routerRedux.push({
        pathname: '/login',
        // query: {uri: encodeURIComponent(window.location.href)}
        search: '?uri='+encodeURIComponent(window.location.href)
      }));
    }
  }

  toLink = (item) => {
    const map = {
      'about': '/about',
      'share': '/shareYc',
      'manager': '/manager',
      'feedback': '',
      'notice': '/follow',
    }
    if(item && item.id && map[item.id]) {
      let pathname = map[item.id]
      if(item.id === 'notice') {
        window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUzMTYyNzM5Mg==&scene=124#wechat_redirect';
        return ;
      }
      if(!this.props.isLogin) {
        pathname = '/login'
        if(item.id === 'about') {
          pathname = map[item.id]
        }
      }
      if(item.id === 'share') {
        // window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + pathname;
        // return;
      }
      pathname && this.props.dispatch(routerRedux.push({
        pathname: pathname
      }))
    }
  }

  toReposit = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/reposit'
    }));
  }

  toCardCenter = () => {
    const { isLogin, info, dispatch } = this.props;
    if(!isLogin) {
      dispatch(routerRedux.push({
        pathname: '/login'
      }));
    } else {
      if(info.stat === 'CERTIFICATION') {
        dispatch(routerRedux.push({
          pathname: '/cardCenter'
        }));
      } else {
        this.toReal();
      }
    }
  }

  toReal = () => {
    alert('实名提示', '您还未实名，需要进行实名认证后才能使用!', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.props.dispatch(routerRedux.push({
        // pathname: '/addDebit'
        pathname: '/uploadId'
      })) },
    ])
  }

  toTradeList = () => {
    const { isLogin, info, dispatch } = this.props;
    if(!isLogin) {
      dispatch(routerRedux.push({
        pathname: '/login'
      }));
    } else {
      if(info.stat === 'CERTIFICATION') {
        dispatch(routerRedux.push({
          pathname: '/tradeList'
        }));
      } else {
        this.toReal();
      }
    }
  }

  renderContent(pageText) {
    if(pageText === 'home') {
      // return this.props.history.push('/home');
    }
    if(pageText === 'myself') {
      return this.renderSelf();
    }
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        {pageText}
      </div>
    )
  }

  toFinishInfo = () => {
    let pathname = '/login';
    if(this.props.isLogin) {
          // pathname = '/addDebit';
        this.props.dispatch(routerRedux.push({
          pathname: '/uploadId'
        }));
        return;
    }
    this.props.dispatch(routerRedux.push({
      pathname
    }));
  }
  
  renderSelf() {
    const { isLogin, info } = this.props;
    const iconSize = '16px';
    const stats = {
      CERTIFICATION: '已实名',
      FREEZE: '已冻结',
      REGISTER: '未实名'
    };
    let username = info && info.customerName || '';
    let st = isLogin && stats[info.stat] || '';
    return (
      <Layout title={'我的'}>
        <div className={styles.normal}>
          {isLogin && info && info.stat !== 'CERTIFICATION'? <div onClick={this.toFinishInfo}><NoticeBar mode="link" icon={
            <div style={{
              width: iconSize,
              height: iconSize,
              background: 'url(' + require('../../assets/icon/wd-tip.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}
            />
          }>
            为了您的账户安全，请先完善个人资料！
          </NoticeBar></div>: null}
          <div className={styles.content}>
            <Flex onClick={this.toLogin} className={styles.head} direction="column">
              <Flex>
                <img src={headImageIcon} style={{width: '64px', height: '64px'}} alt="头像" />
              </Flex>
              <Flex className={styles.loginInfo} direction={'column'}>
              { isLogin && info.companyPhone ? <div>{info.companyPhone}</div>: ''}
              {isLogin ? username + (st ? '('+st+')' : ''):'未登录，请先登录'}
              </Flex>
            </Flex>
            <Flex className={styles.headAddition}>
              <Flex className={styles.tabs}>
                <Flex onClick={this.toReposit} direction='column' className={styles.tabsFlex}>
                  <Flex className={styles.tabsFlexImg} align='end'>
                    <img style={{ width: '35px', height: '27px'}} src={tabsInfo[0].icon} alt={tabsInfo[0].title} />
                  </Flex>
                  <Flex className={styles.tabsFlexFont} align='start'>{tabsInfo[0].title}</Flex>
                </Flex>
                <div className={styles.whiteLine}></div>
                <Flex onClick={this.toCardCenter} direction='column' className={styles.tabsFlex}>
                  <Flex className={styles.tabsFlexImg} align='end'>
                    <img style={{ width: '35px', height: '27px'}} src={tabsInfo[1].icon} alt={tabsInfo[1].title} />
                  </Flex>
                  <Flex className={styles.tabsFlexFont} align='start'>{tabsInfo[1].title}</Flex>
                </Flex>
                <div className={styles.whiteLine}></div>
                <Flex onClick={this.toTradeList} direction='column' className={styles.tabsFlex}>
                  <Flex className={styles.tabsFlexImg} align='end'>
                    <img style={{ width: '35px', height: '27px'}} src={tabsInfo[2].icon} alt={tabsInfo[2].title} />
                  </Flex>
                  <Flex className={styles.tabsFlexFont} align='start'>{tabsInfo[2].title}</Flex>
                </Flex>
              </Flex>
            </Flex>
            <WhiteSpace style={{ height: '90px'}} />
            <List>
            {
              listInfo.map((item) => {
                return (
                  <Item
                    className={styles.listItem}
                    key={item.title}
                    arrow="horizontal"
                    thumb={item.icon}
                    multipleLine
                    onClick={() => { this.toLink(item) }}
                  >
                    {item.title}
                  </Item>
                )
              })
            }

            </List>
          </div>
        </div>
      </Layout>
    );
  }

  toTabLink = (link) => {
    this.props.history.push(link);
  }

  render() {
    const iconSize = '26px';
    return (
      <div className={styles.contentContainer} style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0, overflow: "auto" } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#756145"
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
              this.toTabLink('/reposit')
            }}
            data-seed="logId1"
          >
            {this.renderContent('Koubei')}
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
              // this.toTabLink('/myself')
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
};
function mapStateToProps( state ) {
  const { isLogin, info, codeSend: isSend } = state.user
  return {
    isLogin, isSend, info
  }
}
export default connect( mapStateToProps )(Index);

