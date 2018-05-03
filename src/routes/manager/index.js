import React from 'react';
import { connect } from 'dva';

import PropTypes from 'prop-types';

import { routerRedux } from 'dva/router';
import { Flex, List, Toast } from 'antd-mobile';
import { toDecimal2 } from '../../functions';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

const Item = List.Item;

class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: ''
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'user/getMemberInfo',
      payload: {}
    });
  }
  componentWillUnmount() {

  }

  renderMembers = (item) => {
    return (<Item
      className={styles.listItem}
      thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
      
      extra={toDecimal2((item.inviteAward | 0) / 100)}
      multipleLine onClick={() => { }}>
      {item.customerName || ''}
    </Item>);
  }

  toInvite = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/share'
    }));
  }

  render() {
    const { members } = this.props;
    return (
      <Layout title={'成员管理'}>
        <div className={styles.normal}>
          <div className={styles.content}>
            <Flex justify="center" className={styles.availableMoney}>
              <Flex direction='column'>
                <Flex className={styles.money}>
                  {toDecimal2((this.props.inviteAward | 0) / 100)}
                </Flex>
                <Flex className={styles.moneyDesc}>
                  可分利润额（元）
                </Flex>
              </Flex>
            </Flex>

            <List renderHeader={() => '我的好友（' + members.length + '人）'} className="my-list">
              {
                members.length === 0 ? (<div style={{ 'textAlign': 'center', 'padding': '10px' }}>暂无好友信息!</div>) : members.map(item => this.renderMembers(item))
              }
              {/* <Item
              className={styles.listItem}
              thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
              extra='2017年12月25日'
              multipleLine onClick={() => {}}>
                杨望洋
              </Item> */}


            </List>

            <Flex className={styles.inviteContainer}>
              <Button onClick={this.toInvite} className={styles.invite}>
                立即邀请
              </Button>
            </Flex>

          </div>
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
  members: PropTypes.array
};
function mapStateToProps(state) {
  // console.log(state)
  const { members, isLogin, inviteAward } = state.user

  return {
    isLogin, members: Array.isArray(state.user.members) ? members : [], inviteAward
  }
}
export default connect(mapStateToProps)(Index);
