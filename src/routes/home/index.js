import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Flex, NoticeBar, TabBar } from 'antd-mobile';

import Layout from '../../components/layout';
import Swiper from '../../components/swiper';

import styles from './index.less';


class Index extends React.Component {
  state = {
    hasError: false,
    value: '',
    fullScreen: true
  }
  renderHome() {
    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        <Layout title={'汇藏'}>
          <div className={styles.normal}>
            <Swiper />
            <NoticeBar style={{fontSize: '14px'}} mode="link" action={
              <div className={styles.notify} >去看看</div>
            }>
              雅藏app全新上线，满满诚意，致收藏家们
            </NoticeBar>
            <div className={styles.content}> 
              <Flex className={styles.flexContainer} direction="column">
                <Flex className={styles.flex} direction="row">
                  <Flex className={styles.flex} direction="row">
                    国内藏馆
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={styles.flex} direction="column">
                    臻至美玉
                    </Flex>
                    <Flex className={styles.flex} direction="column">
                    名家书画
                    </Flex>
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={styles.flex} direction="column">
                    臻至美玉
                    </Flex>
                    <Flex className={styles.flex} direction="column">
                    名家书画
                    </Flex>
                  </Flex>
                </Flex>
                
                <Flex className={styles.flex} direction="row">
                  <Flex className={styles.flex} direction="row">
                    海外藏馆
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={styles.flex} direction="column">
                    1
                    </Flex>
                    <Flex className={styles.flex} direction="column">
                    2
                    </Flex>
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={styles.flex} direction="column">
                    1
                    </Flex>
                    <Flex className={styles.flex} direction="column">
                    2
                    </Flex>
                  </Flex>
                </Flex>
                
                <Flex className={styles.flex} direction="row">
                  <Flex className={styles.flex} direction="row">
                    私人藏馆
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={styles.flex} direction="column">
                    1
                    </Flex>
                    <Flex className={styles.flex} direction="column">
                    2
                    </Flex>
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={styles.flex} direction="column">
                    1
                    </Flex>
                    <Flex className={styles.flex} direction="column">
                    2
                    </Flex>
                  </Flex>
                </Flex>
                
              </Flex>
            </div>
            <Flex className={styles.bottom} align="center" justify="center">
              <span>咦，滑到底了，点击查看更多商品</span>
            </Flex>
          </div>
        </Layout>
      </div>
    );
  }
  renderContent(pageText) {
    if(pageText == 'home') {
      return this.renderHome();
    }
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        {pageText}
      </div>
    )
  }
  
  render() {
    
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
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }}
            />
            }
            selectedIcon={<div style={{
              width: '22px',
              height: '22px',
              background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
            />
            }
            selected={this.state.selectedTab === 'blueTab'}
            // badge={1}
            onPress={() => {
              this.setState({
                selectedTab: 'blueTab',
              });
            }}
            data-seed="logId"
          >
            {this.renderContent('home')}
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat' }}
              />
            }
            title="提现"
            key="提现"
            // badge={'new'}
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab',
              });
            }}
            data-seed="logId1"
          >
            {this.renderContent('Koubei')}
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '22px',
                height: '22px',
                background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat' }}
              />
            }
            title="我的"
            key="我的"
            dot
            selected={this.state.selectedTab === 'greenTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'greenTab',
              });
            }}
          >
            {this.renderContent('Friend')}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

Index.propTypes = {
};

export default connect()(Index);
