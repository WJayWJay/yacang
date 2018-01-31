import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Flex, List, InputItem, WhiteSpace, Toast } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

import logo from '../../assets/login-logo.png';

class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
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
                type: 'user/changeCodeSend',
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
      type: 'user/fetchCode',
      payload: {phone: phone}
    })
  }

  alertErrorInfo = () => {
    Toast.info('请输入11位手机号');
  }

  onErrorClick = () => {
    if (this.state.hasError) {
      Toast.info('请输入11位手机号');
    }
  }

  onCodeChange = (value) => {
    this.setState({
      code: value,
    });
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
    const { code, phone } = this.state;
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
    this.props.dispatch({
      type: 'user/loginPost',
      payload: {code, phone}
    })
  }
  
  render() {
    console.log(this.props, 'props')
    const { dispatch } = this.props;
    // if(this.props.isLogin) {
    //   dispatch(routerRedux.push('/home'))
    //   return <div />
    // }
    console.log(this.props.location)
    console.log(this.props.history)
    const {isSend, timeoutInfo} = this.state;
    const iconSize = '24px';
    return (
      <Layout title={'登录'}>
        <div className={styles.normal}>   
          <div className={styles.content}> 
            <Flex justify="center" className={styles.logo}>
              <img src={logo} alt="logo" style={{width: '110px', height: '110px'}} />
            </Flex>
            <Flex direction="column">
              <List className={styles.myList}>
                <InputItem
                  clear
                  style={{fontSize: '16px',opacity: 0.4}}  
                  labelNumber={2}
                  maxLength={12}
                  placeholder="请输入手机号"
                  onChange={this.onChange}
                  ref={el => this.phoneInput = el}
                  value={this.state.phone}
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
                  extra={<div 
                      onClick={() => this.getCheckCode()} 
                      style={{backgroundColor: isSend===1? '#CECECE':'#57493F'}} 
                      className={styles.getCheckCode}
                  >{timeoutInfo}</div>}
                  labelNumber={2}
                  ref={el => this.codeInput = el}
                  placeholder="请输入验证码"
                  maxLength={6}
                  onChange={this.onCodeChange}
                >
                  <div style={{
                    width: iconSize,
                    height: iconSize,
                    background: 'url(' + require('../../assets/login/login-key.png') +') center center /  '+iconSize +' '+iconSize+'  no-repeat' }}  
                  />
                </InputItem>
              </List>
              <List className={styles.myList}>
                <Button onClick={this.submit} className={styles.deleteButton}>登录</Button>
              </List>
            </Flex>
            
            <Flex className={styles.register} align="center" justify="center">
              <Flex.Item>
                <Link to="/register"> 新用户注册 </Link>
              </Flex.Item>
            </Flex>
            
            <Flex className={styles.copyright} direction="column">
              <Flex.Item>
                广州雅藏文化传播有限公司 
              </Flex.Item>
              <Flex.Item>
                Copyright@2015～2035
              </Flex.Item>
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
  // console.log(state)
  const { isLogin, codeSend: isSend } = state.user
  return {
    isLogin, isSend
  }
}
export default connect( mapStateToProps )(Index);
