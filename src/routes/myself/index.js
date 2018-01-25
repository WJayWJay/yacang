import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Flex, List, WhiteSpace, Toast, NoticeBar, Icon, TabBar } from 'antd-mobile';

import Layout from '../../components/layout';

import styles from './index.less';

import headImageIcon from '../../assets/myself/wd-user.png';
import reviceMoneyIcon from '../../assets/myself/wd-wysk.png';
import cardCenterIcon from '../../assets/myself/wd-kzx.png';
import tradeRecordIcon from '../../assets/myself/wd-cjgl.png';

const Item = List.Item;

const tabsInfo= [
  {title: '我要收款', icon: reviceMoneyIcon},
  {title: '卡中心', icon: cardCenterIcon},
  {title: '成交记录', icon: tradeRecordIcon},
];
const listInfo= [
  {id: 'manager', title: '成员管理', icon: require('../../assets/myself/wd-cy.png') },
  {id: 'share', title: '推荐给好友', icon: require('../../assets/myself/wd-tj.png') },
  {id: 'about', title: '关于雅藏', icon: require('../../assets/myself/wd-gy.png') },
  {id: 'feedback', title: '帮助反馈', icon: require('../../assets/myself/wd-bz.png') },
  {id: 'notice', title: '关注公众号', icon: require('../../assets/myself/wd-gz.png') },
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
    this.props.history.push('/login');
  }

  toLink = (item) => {
    const map = {
      'about': '/about',
      'share': '/share',
      'manager': '/manager',
      'feedback': '/about',
      'notice': '/about',
    }
    if(item && item.id && map[item.id]) {
      this.props.history.push(map[item.id]);
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

  renderSelf() {
    const { isLogin, info } = this.props;
    console.log(isLogin, info, 'mysel')
    const username = info ? info.customerName||info.companyPhone : ''; 
    const iconSize = '16px';
    return (
      <Layout title={'我的'}>
        <div className={styles.normal}>
          {isLogin? <NoticeBar mode="closable" icon={
            <div style={{
              width: iconSize,
              height: iconSize,
              background: 'url(' + require('../../assets/icon/wd-tip.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}
            />
          }>
            为了您的账户安全，请先完善个人资料！
          </NoticeBar>: null}
          <div className={styles.content}>
            <Flex onClick={this.toLogin} className={styles.head} direction="column">
              <Flex>
                <img src={headImageIcon} style={{width: '64px', height: '64px'}} alt="头像" />
              </Flex>
              <Flex className={styles.loginInfo}>
              {isLogin ? username:'未登录，请先登录'}
              </Flex>
            </Flex>
            <Flex className={styles.headAddition}>
              <Flex className={styles.tabs}>
                <Flex direction='column' className={styles.tabsFlex}>
                  <Flex className={styles.tabsFlexImg} align='end'>
                    <img style={{ width: '35px', height: '27px'}} src={tabsInfo[0].icon} alt={tabsInfo[0].title} />
                  </Flex>
                  <Flex className={styles.tabsFlexFont} align='start'>{tabsInfo[0].title}</Flex>
                </Flex>
                <div className={styles.whiteLine}></div>
                <Flex onClick={()=> this.props.history.push('/cardCenter')} direction='column' className={styles.tabsFlex}>
                  <Flex className={styles.tabsFlexImg} align='end'>
                    <img style={{ width: '35px', height: '27px'}} src={tabsInfo[1].icon} alt={tabsInfo[1].title} />
                  </Flex>
                  <Flex className={styles.tabsFlexFont} align='start'>{tabsInfo[1].title}</Flex>
                </Flex>
                <div className={styles.whiteLine}></div>
                <Flex direction='column' className={styles.tabsFlex}>
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
      <div style={this.state.fullScreen ? { position: 'fixed', height: '100%', width: '100%', top: 0 } : { height: 400 }}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="雅藏"
            key="雅藏"
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
            title="提现"
            key="提现"
            // badge={'new'}
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              // this.toLink('/reposit')
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
  console.log(state,'myself')
  const { isLogin, info, codeSend: isSend } = state.user
  return {
    isLogin, isSend, info
  }
}
export default connect( mapStateToProps )(Index);

