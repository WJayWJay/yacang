import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { List } from 'antd-mobile';

import PropTypes from 'prop-types';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

const Item = List.Item;

class CardCenter extends React.Component {
  state = {
    hasError: false,
    value: '',
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'card/fetchCard',
      payload: {}
    });
  }

  logout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/logout',
      payload: {}
    });
    this.props.history.push('/home');
  }

  revisePwd = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/revisePass',
    }));
  }

  render() {
    const { isLogin, info } = this.props;
    let userInfo = Object.assign({}, info);
    if(!isLogin) {
      this.props.history.push({
        pathname: '/login',
        query: {uri: encodeURI(window.location.href)}
      });
      return;
    }
    const stats = {
      CERTIFICATION: '已实名',
      FREEZE: '已冻结',
      REGISTER: '已注册(未实名)'
    };
    return (
      <Layout title={'个人信息'}>
        <div className={styles.normal}>
          <div className={styles.content}>
            <List className={styles.myList}>
              <Item extra={ userInfo.customerName || userInfo.companyPhone || ''}>姓名</Item>
              <Item extra={'----'}>身份证</Item>
              <Item extra={ userInfo.companyPhone || ''}>手机号码</Item>
            </List>
            <List renderHeader={() => '账户状态'} className={styles.myList}>
              <Item extra={!userInfo.stat ? '未实名': stats[userInfo.stat]} arrow="horizontal" onClick={() => {}}>账户状态</Item>
              <Item extra={"3张"} arrow="horizontal" onClick={() => {}}>我的银行卡</Item>
              <Item extra="" arrow="horizontal" onClick={this.revisePwd}>修改支付密码</Item>
            </List>
          </div>

          <Button onClick={this.logout} className={styles.deleteButton}>注销账户</Button>
        </div>
      </Layout>
    );
  }
}

CardCenter.propTypes = {
  info: PropTypes.object
};

function mapStateToProps( state ) {
  const { isLogin, info } = state.user
  return {
    isLogin, info
  }
}


export default connect(mapStateToProps)(CardCenter);
