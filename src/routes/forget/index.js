import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import PropTypes from 'prop-types';
import { Flex, List, InputItem, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';

import { isPhone } from '../../functions'
import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';


class Index extends React.Component {
  state = {
    smsInfo: '获取验证码',
    itime: 60,
    sendDisabled: false,
  }

  intervId = 0;

  componentWillUnmount() {
    this.intervId && clearInterval(this.intervId);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.resetSmsSend === 0) {
      this.startInterv();
    } else {
      this.intervId && clearInterval(this.intervId);
      this.setState({
        sendDisabled: false
      })
    }
  }
  startInterv() {
    this.intervId = setInterval(() => {
      let time = this.state.itime;
      if(time < 1) {
        this.intervId && clearInterval(this.intervId);
        this.setState({
          smsInfo: '获取验证码',
          sendDisabled: false,
          itime: 60
        });
        this.props.dispatch({
          type: 'user/updateState',
          payload: {resetSmsSend: -1}
        });
        return;
      }
      this.setState({
        smsInfo: '获取验证码（'+time+'）'
      }, () => {
        this.setState({
          itime: --time
        })
      });
    }, 1000);
  }

  getCode = (e) => {
    e.preventDefault();
    const { getFieldError } = this.props.form;
    if(!!getFieldError('messages')) {
      Toast.show('验证码格式错误！');
      return;
    }
    if(!!getFieldError('companyPhone')) {
      Toast.show('手机号格式错误！');
      return;
    }
    this.setState({
      sendDisabled: true,
    });
    this.props.dispatch({
      type: 'user/fetchResetCode',
      payload: {type: ''}
    });
  }
  submit = (e) => {
    const { dispatch } = this.props;
    let errors = null;
    this.props.form.validateFields((error, values) => {
      console.log(error, values)
      if(error) {
        errors = error;
        return ;
      }
    });

    if(errors) {
      return;
    }

    dispatch(routerRedux.push({
      pathname: '/forget2'
    }));
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { resetPasswords } = this.props;
    return (
      <Layout title={'忘记密码'}>
        <div className={styles.normal}>
          <div className={styles.content}>
            <Flex direction="column">
              {/* <List renderHeader={() => '为保证您的账户安全，请完成身份'} className={styles.myList}>
                <InputItem
                  clear
                  {...getFieldProps('realName', {
                    initialValue: '',
                    rules: [{
                      required: true,
                    }],
                  })}
                  error={!!getFieldError('realName')}
                  style={{fontSize: '16px',opacity: 0.5}}
                  placeholder="请输入真实姓名"
                  ref={el => this.autoFocusInst = el}
                >姓名</InputItem>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.5}}
                  placeholder="请输入身份证号"
                >身份证</InputItem>
              </List> */}

              <List renderHeader={() => '为保证您的账户安全，请完成身份'} style={{marginTop: '11px'}} className={styles.myList}>
                <InputItem
                  clear
                  {...getFieldProps('companyPhone', {
                    initialValue: resetPasswords.companyPhone || '',
                    rules: [{
                      validator: (rule, value, cb) => {
                        if(!isPhone(value)) {
                          cb(new Error('手机号格式错误！'));
                        } else {
                          cb();
                        }
                      }
                    }],
                  })}
                  error={!!getFieldError('companyPhone')}
                  style={{fontSize: '16px',opacity: 0.5}}
                  placeholder="请输入手机号码"
                >手机号码</InputItem>


                <InputItem
                  type="number"
                  {...getFieldProps('messages', {
                    initialValue: '',
                    rules: [{
                      required: true,
                      validator: (rule, value, cb) => {
                        value && value.length >3 && value.length <7 ? cb():cb(new Error('验证码格式错误'))
                      }
                    }],
                  })}
                  maxLength={6}
                  placeholder="请输入验证码"
                  error={!!getFieldError('messages')}
                  extra={<Button
                          disabled={this.state.sendDisabled}
                          onClick={this.getCode}
                          inline
                          className={styles.getSmsCode}
                          type="primary">{this.state.smsInfo || ''}</Button>}
                >验证码</InputItem>
              </List>
            </Flex>

            <Button onClick={this.submit} className={styles.saveButton}>下一步</Button>
          </div>
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
  resetPasswords: PropTypes.object
};

function mapStateToProps(state) {
  const { info, resetPasswords, resetSmsSend } = state.user;

  return {
    info,
    resetPasswords,
    resetSmsSend
  }
}


const ForgetForm = createForm({
  onValuesChange(props, value) {
    props.dispatch({
      type: 'user/resetPasswords',
      payload: value,
    });
  },
})(Index);

export default connect(mapStateToProps)(ForgetForm);
