import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Flex, NoticeBar, TabBar } from 'antd-mobile';

import Layout from '../../components/layout';
import Swiper from '../../components/swiper';

import Myself from '../myself'

import styles from './index.less';


class Index extends React.Component {
  state = {
    hasError: false,
    value: '',
    fullScreen: true
  }

  componentDidMount() {
    let page = 1;
    // this.props.dispatch({
    //   type: 'product/fetch',
    //   payload: {page}
    // });
  }

  renderHome() {
    console.log(this.props)
    const first = ['国内藏馆1', '臻至美玉', '名家书画', '臻至美玉', '名家书画'];
    const second = ['国内藏馆2', '臻至美玉', '名家书画', '臻至美玉', '名家书画'];
    const third = ['国内藏馆3', '臻至美玉', '名家书画', '臻至美玉', '名家书画'];
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
                  <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneFirst, styles.firstRowOneSpecial1]} direction="row">
                    { first[0] }
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneSecond1]} direction="column">
                    { first[1] }
                    </Flex>
                    <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneSecond2]} direction="column">
                    { first[2] }
                    </Flex>
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneThird, styles.rightTopRadius]} direction="column">
                    { first[3] }
                    </Flex>
                    <Flex className={[styles.flex, styles.firstRowOne]} direction="column">
                    { first[4] }
                    </Flex>
                  </Flex>
                </Flex>
                {/* 2 */}
                <Flex className={[styles.flex, styles.column]} direction="row">
                  <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneFirst, styles.secondRowOneSpecial1]} direction="row">
                  { second[0] }
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneSecond1]} direction="column">
                    { second[1] }
                    </Flex>
                    <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneSecond2]} direction="column">
                    { second[2] }
                    </Flex>
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneThird]} direction="column">
                    { second[3] }
                    </Flex>
                    <Flex className={[styles.flex, styles.firstRowOne]} direction="column">
                    { second[4] }
                    </Flex>
                  </Flex>
                </Flex>
                {/* 3 */}
                <Flex className={[styles.flex, styles.column]} direction="row">
                  <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneFirst, styles.thirdRowOneSpecial1]} direction="row">
                  { third[0] }
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneSecond1]} direction="column">
                    { third[1] }
                    </Flex>
                    <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneSecond2]} direction="column">
                    { third[2] }
                    </Flex>
                  </Flex>
                  <Flex className={styles.flex} direction="column">
                    <Flex className={[styles.flex, styles.firstRowOne, styles.firstRowOneThird]} direction="column">
                    { third[3] }
                    </Flex>
                    <Flex className={[styles.flex, styles.firstRowOne, styles.bottomTopRadius]} direction="column">
                    { third[4] }
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

  renderMy = () => {
    return <Myself {...this.props} />
  }

  renderContent(pageText) {
    if(pageText === 'home') {
      return this.renderHome();
    }
    if(pageText === 'myself') {
      return this.renderMy();
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
              this.setState({
                selectedTab: 'greenTab',
              });
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

function mapStateToProps(state) {
  // const { list, total } = state.user;
  const { isLogin, codeSend: isSend } = state.user
  return {
    isLogin, isSend
  }
}

export default connect(mapStateToProps)(Index);
