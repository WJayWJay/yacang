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
    const { isLogin, info, dispatch } = this.props;
    if (!isLogin) {
      dispatch(routerRedux.push({
        pathname: '/login'
      }));
    } else {
      if (info.stat === 'CERTIFICATION') {
        dispatch(routerRedux.push({
          pathname: '/revisePass'
        }));
      } else {
        // dispatch(routerRedux.push({
        //   pathname: '/addDebit'
        // }));
        dispatch(routerRedux.push({
          pathname: '/uploadId'
        }));
      }
    }
  }
  toLinkTo = (link) => {
    const { isLogin, info, dispatch } = this.props;
    console.log(link)
    if (!isLogin) {
      dispatch(routerRedux.push({
        pathname: '/login'
      }));
    } else {
      dispatch(routerRedux.push({
        pathname: link
      }));
    }
  }

  toVery = () => {
    const { isLogin, info } = this.props;
    let userInfo = Object.assign({}, info);    
    if(isLogin && userInfo.stat === 'REGISTER') {
      this.props.history.push({
        pathname: '/uploadId'
      });
    }
  }

  render() {
    const { isLogin, info, cardList } = this.props;
    let userInfo = Object.assign({}, info);
    if (!isLogin) {
      this.props.history.push({
        pathname: '/login',
        query: { uri: encodeURI(window.location.href) }
      });
      return;
    }
    const stats = {
      CERTIFICATION: '已实名',
      FREEZE: '已冻结',
      REGISTER: <span style={{color: 'red'}}>已注册(未实名)</span>
    };
    return (
      <Layout title={'个人信息'}>
        <div className={styles.normal}>
          <div className={styles.content}>
            <List className={styles.myList}>
              <Item extra={userInfo.customerName || '--'}>姓名</Item>
              <Item extra={cardList.length > 0 ? cardList[0].idCardNo : '----'}>身份证</Item>
              <Item extra={userInfo.companyPhone || ''}>手机号码</Item>
            </List>
            <List renderHeader={() => '账户状态'} className={styles.myList}>
              <Item extra={!userInfo.stat ? '未实名' : stats[userInfo.stat]} arrow="horizontal" onClick={this.toVery}>账户状态</Item>
              <Item onClick={() => this.toLinkTo('/cardCenter')} extra={cardList.length + "张"} arrow="horizontal" >我的银行卡</Item>
              <Item extra="" arrow="horizontal" onClick={this.revisePwd}>修改支付密码</Item>
            </List>
          </div>
          <Button onClick={this.logout} className={styles.deleteButton}>退出登录</Button>
        </div>
      </Layout>
    );
  }
}

CardCenter.propTypes = {
  info: PropTypes.object
};

function mapStateToProps(state) {
  const { isLogin, info } = state.user
  return {
    isLogin, info, cardList: state.card.cardList
  }
}


export default connect(mapStateToProps)(CardCenter);
