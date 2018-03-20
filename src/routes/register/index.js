import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { routerRedux } from 'dva/router';
import { Flex, List, InputItem, Icon, WhiteSpace, Toast } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';


class Index extends React.Component {
  state = {
    hasError: false,
    inviteCode: '',
    phone: '',
    code: '',
    timeout: 0,
    timeoutInfo: '获取验证码',
    isSend: 0
  }

  componentDidMount() {
    try {
      let phone = localStorage.getItem('key@phone');
      phone && phone.length > 9 && this.setState({phone: phone});
    } catch(e) {}
  }
  componentWillUnmount() {
    if(this.intervId) {
      clearInterval(this.intervId);
    }
  }

  componentWillReceiveProps(newProps) {
    const { isSend } = this.state;
    console.log(newProps)
    if(newProps.registerStatus === 0) {
      // this.props.dispatch(routerRedux.push('/login'));
    }
    if(isSend !== newProps.isSend) {
      if(newProps.isSend === 1) {
        this.setState({
          isSend: newProps.isSend,
          timeout: 60
        }, () => {
          this.intervId = setInterval(() => {
            let t = this.state.timeout;
            if(isNaN(parseInt(t, 10))) {
              t = 60;
            }
            console.log(t,'current t');
            if(t <1) {
              this.setState({
                timeout: 60,
                timeoutInfo: '获取验证码'
              });
              if(this.intervId) {
                clearInterval(this.intervId);
              }
              this.props.dispatch({
                type: 'register/changeCodeSend',
                payload: {codeSend: 0}
              })
              return;
            }
            t = t-1;
            this.setState({
              timeout: t,
              timeoutInfo: '获取验证码 ('+ t +')'
            });
          }, 1000)
        });
      } else {
        this.setState({
          isSend: newProps.isSend
        });
      }
    }
  }

  getCheckCode=() => {
    const { phone , hasError, isSend} = this.state;
    if(isSend === 1) return;
    if(hasError) {
      this.alertErrorInfo();
      return;
    }
    this.props.dispatch({
      type: 'register/fetchCode',
      payload: {phone: phone}
    })
  }

  onCodeChange = (value) => {
    this.setState({
      code: value,
    });
  }
  onInviteCodeChange = (value) => {
    this.setState({
      inviteCode: value,
    });
  }

  alertErrorInfo = () => {
    Toast.info('请输入11位手机号');
  }

  onChange = (value) => {
    console.log(value)
    if (value.replace(/\s/g, '').length < 11 || !value.startsWith('1')) {
      this.setState({
        hasError: true,
      });
    } else {
      this.setState({
        hasError: false,
      });
      try {
        localStorage.setItem('key@phone', value);
      } catch(e) {}
    }
    this.setState({
      phone: value,
    });
  }
  
  submit = () => {
    const { code, phone, inviteCode } = this.state;
    if(!code) {
      this.codeInput && this.codeInput.focus();
      Toast.fail('验证码不能为空');
      return;
    }
    if(!phone) {
      this.phoneInput && this.phoneInput.focus();
      Toast.fail('手机号不能为空');
      return;
    }
    if(!inviteCode) {
      this.inviteCode && this.inviteCode.focus();
      Toast.fail('邀请码不能为空');
      return;
    }
    this.props.dispatch({
      type: 'register/userRegister',
      payload: {code, phone, inviteCode}
    })
  }

  render() {
    const iconSize = '24px';
    const {isSend, timeoutInfo} = this.state;
    return (
      <Layout title={'用户注册'}>
        <div className={styles.normal}>   
          <div className={styles.content}> 
            <Flex direction="column">
              <List className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.4}}  
                  labelNumber={2}
                  placeholder="请输入邀请码"
                  ref={el => this.inviteCode = el}
                  onChange={this.onInviteCodeChange}
                ><div style={{
                  width: iconSize,
                  height: iconSize,
                  background: 'url(' + require('../../assets/register/register-code.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}  
                />
                </InputItem>
              </List>
              <WhiteSpace />
              <List className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.4}}  
                  labelNumber={2}
                  placeholder="请输入手机号"
                  maxLength={13}
                  ref={el => this.phoneInput = el}
                  value={this.state.phone}
                  onChange={this.onChange}
                  onErrorClick={this.onErrorClick}
                ><div style={{
                  width: iconSize,
                  height: iconSize,
                  background: 'url(' + require('../../assets/login/login-phone.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}  
                /></InputItem>
              </List>
              <WhiteSpace />
              <List className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.4}}  
                  extra={<div className={styles.getCheckCode}
                      onClick={() => this.getCheckCode()} 
                      style={{backgroundColor: isSend===1? '#CECECE':'#57493F'}}
                  >{timeoutInfo}</div>}
                  labelNumber={2}
                  ref={el => this.codeInput = el}
                  placeholder="请输入验证码"
                  maxLength={6}
                  onChange={this.onCodeChange}
                ><div style={{
                  width: iconSize,
                  height: iconSize,
                  background: 'url(' + require('../../assets/login/login-key.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}  
                /></InputItem>
              </List>
              <List className={styles.myList}>
                <Button onClick={this.submit} className={styles.deleteButton}>完成注册</Button>
              </List>
            </Flex>
            
            <Flex justify="center" style={{marginTop: '150px', marginBottom: '38px', fontSize: '14px'}}>
                <Icon type="check-circle-o" color={'#8C8C9E'} size={'xs'} />
                <span className={styles.agree} >点击立即注册，即代表同意</span>
                <span className={styles.agreeUserProto} >《 用户协议 》</span>
            </Flex>
          </div>
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
};

function mapStateToProps( state ) {
  console.log(state)
  const { codeSend: isSend, registerStatus } = state.register
  return {
    isSend,
    registerStatus,
    loading: state.loading.models.register,
  }
}

export default connect(mapStateToProps)(Index);
