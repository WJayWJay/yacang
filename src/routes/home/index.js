import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
// import { Link } from 'dva/router';
import { routerRedux } from 'dva/router';

import { Flex, NoticeBar, TabBar, Carousel } from 'antd-mobile';

import Layout from '../../components/layout';
import Swiper from '../../components/swiper';


import styles from './index.less';


class Index extends React.Component {
  state = {
    hasError: false,
    value: '',
    fullScreen: true,
    selectedTab: 'blueTab',
    tagIndex: 0
  }
  _tagChangeInterval = 0;

  componentDidMount() {
    const { dispatch } = this.props;


    dispatch({
      type: 'home/fetch',
      payload: { type: 'msg' }
    });
    dispatch({
      type: 'home/fetch',
      payload: { type: 'img' }
    });
    dispatch({
      type: 'product/fetchCategory',
      payload: {}
    });
    this._tagChangeInterval = setInterval(() => {
      let len = this.props.tagList.length || 0;
      let tagIndex = this.state.tagIndex;
      len && this.setState({
        tagIndex: (tagIndex + 1) >= len ? 0 : tagIndex + 1
      });
    }, 6000);
  }
  componentWillUnmount() {
    this._tagChangeInterval && clearInterval(this._tagChangeInterval);
  }

  componentWillReceiveProps(nextProps) {
  }
  toCatLink = (cid) => {
    // console.log(cid); return;
    cid && this.props.dispatch(routerRedux.push({
      pathname: '/productList',
      search: '?cid=' + cid
    }));
  }
  renderTagList = (item) => {
    let first = item.children;
    return (<Flex key={item.categoryNo} className={[styles.flex, styles.flexItem]} direction="row">
      <Flex onClick={() => this.toCatLink(item.categoryNo)} className={[styles.flex, styles.firstRowOne, styles.firstRowOneFirst, styles.firstRowOneSpecial1]} direction="row">
        {item.categoryName || ''}
      </Flex>
      <Flex className={styles.flex} direction="column">
        <Flex onClick={() => this.toCatLink(first[0] && first[0].categoryNo || '')} className={[styles.flex, styles.firstRowOne, styles.firstRowOneSecond1]} direction="column">
          {first[0] && first[0].categoryName || ''}
        </Flex>
        <Flex onClick={() => this.toCatLink(first[1] && first[1].categoryNo || '')} className={[styles.flex, styles.firstRowOne, styles.firstRowOneSecond2]} direction="column">
          {first[1] && first[1].categoryName || ''}
        </Flex>
      </Flex>
      <Flex className={styles.flex} direction="column">
        <Flex onClick={() => this.toCatLink(first[2] && first[2].categoryNo || '')} className={[styles.flex, styles.firstRowOne, styles.firstRowOneThird, styles.rightTopRadius]} direction="column">
          {first[2] && first[2].categoryName || ''}
        </Flex>
        <Flex onClick={() => this.toCatLink(first[3] && first[3].categoryNo || '')} className={[styles.flex, styles.firstRowOne, styles.lastOne]} direction="column">
          {first[3] && first[3].categoryName || ''}
        </Flex>
      </Flex>
    </Flex>);
  }

  renderHome() {
    const { swiperList, category, tagList } = this.props;
    let list = swiperList;
    let currentTag = tagList[this.state.tagIndex];
    // console.log(currentTag, 'cur')
    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        <Layout title={'汇藏'}>
          <div className={styles.normal}>
            <Swiper items={list} />
            {tagList.length ? <Carousel className="my-carousel"
              vertical
              dots={false}
              dragging={false}
              swiping={false}
              autoplay
              infinite
              speed={300}
              autoplayInterval={8000}
              resetAutoplay={false}
            >
              {tagList.map( tag => <NoticeBar
                key={tag.title}
                onClick={() => { tag.url && (window.location.href = tag.url); }}
                marqueeProps={{ loop: true, fps: 50, style: { padding: '0 7.5px' } }} style={{ fontSize: '14px' }} mode="link" action={
                  <div className={styles.notify} >去看看</div>
                }>
                {tag.title || ''}
              </NoticeBar>)} 
            </Carousel>: null}




            {/* {currentTag ?
              <NoticeBar
                onClick={() => { currentTag.url && (window.location.href = currentTag.url); }}
                marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} style={{ fontSize: '14px' }} mode="link" action={
                  <div className={styles.notify} >去看看</div>
                }>
                {currentTag.title || ''}
              </NoticeBar> : null} */}
            <div className={styles.content}>
              <Flex className={styles.flexContainer} direction="column">
                {category.map(this.renderTagList)}
              </Flex>
            </div>
            {/* <Flex className={styles.bottom} align="center" justify="center">
              <span><Link to='/productList'>咦，滑到底了，点击查看更多商品</Link></span>
            </Flex> */}
          </div>
        </Layout>
      </div>
    );
  }

  renderMy = () => {

  }

  renderContent(pageText) {
    if (pageText === 'home') {
      return this.renderHome();
    }
    if (pageText === 'myself') {

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
        {/* // <div className={styles.contentContainer} > */}
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
              background: 'url(' + require('../../assets/tabbar/tab-sy-normal.png') + ') center center /  ' + iconSize + ' ' + iconSize + '  no-repeat'
            }}
            />
            }
            selectedIcon={<div style={{
              width: iconSize,
              height: iconSize,
              background: 'url(' + require('../../assets/tabbar/tab-sy-click.png') + ') center center /  ' + iconSize + ' ' + iconSize + '  no-repeat'
            }}
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
                background: 'url(' + require('../../assets/tabbar/tab-tx-normal.png') + ') center center /  ' + iconSize + ' ' + iconSize + '  no-repeat'
              }}
              />
            }
            selectedIcon={
              <div style={{
                width: iconSize,
                height: iconSize,
                background: 'url(' + require('../../assets/tabbar/tab-tx-click.png') + ') center center /  ' + iconSize + ' ' + iconSize + '  no-repeat'
              }}
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
                background: 'url(' + require('../../assets/tabbar/tab-wd-normal.png') + ') center center /  ' + iconSize + ' ' + iconSize + '  no-repeat'
              }}
              />
            }
            selectedIcon={
              <div style={{
                width: iconSize,
                height: iconSize,
                background: 'url(' + require('../../assets/tabbar/tab-wd-click.png') + ') center center /  ' + iconSize + ' ' + iconSize + '  no-repeat'
              }}
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
  const { swiperList, tagList } = state.home;
  const { category } = state.product;

  return {
    isLogin, swiperList, tagList, category: category || []
  }
}

export default connect(mapStateToProps)(Index);
