import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
// import { Link } from 'dva/router';
import { Flex, NoticeBar, TabBar } from 'antd-mobile';

import Layout from '../../components/layout';
import Swiper from '../../components/swiper';


import styles from './index.less';


class Index extends React.Component {
  state = {
    hasError: false,
    value: '',
    fullScreen: true,
    selectedTab: 'blueTab',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/fetch',
      payload: {type:'msg'}
    });
    dispatch({
      type: 'home/fetch',
      payload: {type:'img'}
    });
    dispatch({
      type: 'product/fetchCategory',
      payload: {}
    });
  }

  componentWillReceiveProps(nextProps) {
  }


  renderHome() {
    const { swiperList, tagList } = this.props;
    const first = ['国内藏馆1', '臻至美玉', '名家书画', '臻至美玉', '名家书画'];
    const second = ['国内藏馆2', '臻至美玉', '名家书画', '臻至美玉', '名家书画'];
    const third = ['国内藏馆3', '臻至美玉', '名家书画', '臻至美玉', '名家书画'];
    let list = swiperList;

    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        <Layout title={'汇藏'}>
          <div className={styles.normal}>
            <Swiper items={list} />
            <NoticeBar style={{fontSize: '14px'}} mode="link" action={
              <div className={styles.notify} >去看看</div>
            }>
              汇藏app全新上线，满满诚意，致收藏家们
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
              <span><Link to='/productList'>咦，滑到底了，点击查看更多商品</Link></span>
            </Flex>
          </div>
        </Layout>
      </div>
    );
  }

  renderMy = () => {

  }

  renderContent(pageText) {
    if(pageText === 'home') {
      return this.renderHome();
    }
    if(pageText === 'myself') {

    }
    return (
      <div style={{ backgroundColor: 'white', height: '101%', textAlign: 'center' }}>
        {pageText}
      </div>
    )
  }

  toLink = (link) => {
    this.props.history.push(link);
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
              // this.toLink('/')
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
              this.toLink('/reposit')
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
              this.toLink('/myself')
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
  const { isLogin } = state.user
  const { swiperList, tagList  } = state.home;
  const { category } = state.product;
  
  return {
    isLogin, swiperList, tagList, category
  }
}

export default connect(mapStateToProps)(Index);
