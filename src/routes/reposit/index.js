import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Flex, List, WhiteSpace, Toast, Radio, TabBar } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

import zhaoshangIcon from '../../assets/card/card-zhaoshang.png';
import jianhangIcon from '../../assets/card/card-jianhang.png';

const Item = List.Item;
const Brief = Item.Brief;

class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: '',
    selectedTab: 'redTab',
    fullScreen: true
  }
  
  componentDidMount() {
    
  }
  componentWillUnmount() {
    
  }
  
  
  renderSelf() {

    return (
      <Layout title={'提现'}>
        <div className={styles.normal}>   
          <div className={styles.content}> 
            
            <List renderHeader={() => '提现信用卡'} className="my-list">
              <Item 
              className={styles.listItem}
              thumb={<img className={styles.listItemIcon} src={zhaoshangIcon} alt="zhaoshang" />}
              arrow='horizontal'
              multipleLine onClick={() => {}}>
                招商银行 <Brief>尾号2528 信用卡</Brief> 
              </Item>
            </List>
            <WhiteSpace />
            <List renderHeader={() => '到账银行'} className="my-list">
              <Item 
              className={styles.listItem}
              thumb={<img className={styles.listItemIcon} src={zhaoshangIcon} alt="zhaoshang" />}
              arrow='horizontal'
              multipleLine onClick={() => {}}>
                招商银行 <Brief>尾号2528 信用卡</Brief> 
              </Item>
            </List>

            <WhiteSpace />
            <List renderHeader={() => '选择支付方式'} className="my-list">
              <Item 
              className={styles.listItem}
              extra={<Radio checked={true} className={styles.myRadio} onChange={e => console.log('checkbox', e)}></Radio>}
              multipleLine onClick={() => {}}>
                极速到账 <Brief>提现手续费  0.01%</Brief> 
              </Item>

              <Item 
              className={styles.listItem}
              extra={<Radio className={styles.myRadio} onChange={e => console.log('checkbox', e)}></Radio>}
              multipleLine onClick={() => {}}>
                极速到账 + 额外获得积分 <Brief>提现手续费  0.015%</Brief> 
              </Item>

              <Item 
              className={styles.listItem}
              extra={<Radio className={styles.myRadio} onChange={e => console.log('checkbox', e)}></Radio>}
              multipleLine onClick={() => {}}>
                普通到账 + 额外获得积分 <Brief>提现手续费  0.015%</Brief> 
              </Item>
            </List>
            
            <Flex className={styles.inviteContainer}>
              <Button className={styles.invite}>
              立即提现
              </Button>
            </Flex>
            
          </div>
        </div>
      </Layout>
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
};
function mapStateToProps( state ) {
  // console.log(state)
  const { isLogin, codeSend: isSend } = state.user
  return {
    isLogin, isSend
  }
}
export default connect( mapStateToProps )(Index);
