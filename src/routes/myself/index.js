import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Flex, List, WhiteSpace, Toast, NoticeBar, Icon } from 'antd-mobile';

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
      'share': '/about',
      'manager': '/about',
      'feedback': '/about',
      'notice': '/about',
    }
    if(item && item.id && map[item.id]) {
      this.props.history.push(map[item.id]);
    }
  }


  render() {
    const { isLogin, info } = this.props;

    const iconSize = '16px';
    return (
      <Layout title={'我的'}>
        <div className={styles.normal}>
          <NoticeBar mode="closable" icon={
            <div style={{
              width: iconSize,
              height: iconSize,
              background: 'url(' + require('../../assets/icon/wd-tip.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}
            />
          }>
            为了您的账户安全，请先完善个人资料！
          </NoticeBar>
          <div className={styles.content}>
            <Flex onClick={this.toLogin} className={styles.head} direction="column">
              <Flex>
                <img src={headImageIcon} style={{width: '64px', height: '64px'}} alt="头像" />
              </Flex>
              <Flex className={styles.loginInfo}>
              {isLogin ? info.customerName :'未登录，请先登录'}
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
                <Flex direction='column' className={styles.tabsFlex}>
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
}

Index.propTypes = {
};
function mapStateToProps( state ) {
  console.log(state,'myself')
  const { isLogin, codeSend: isSend } = state.user
  return {
    isLogin, isSend
  }
}
// export default connect( )(Index);
export default Index;
