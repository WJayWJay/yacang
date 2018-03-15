import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Flex, InputItem, List , WhiteSpace, Icon, DatePicker, Toast} from 'antd-mobile';
import { createForm } from 'rc-form';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

class AddDebitCard extends React.Component {
  state = {
    hasError: false,
    smsInfo: '获取验证码',
    itime: 60,
    sendDisabled: false,
    agreeColor: '#8C8C9E',
  };
  intervId = 0;


  componentDidMount() {
    this.props.dispatch({
      type: 'card/savedDebitFields',
      payload: {
        confirmPassword: '',
        password: ''
      },
    });
  }

  componentWillUnmount() {
    this.intervId && clearInterval(this.intervId);
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.debitSmsSend, 'jjjjj')
    if(nextProps.debitSmsSend === 0) {
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
          type: 'card/updateState',
          payload: {debitSmsSend: -1}
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
    if(!!getFieldError('smsCode')) {
      Toast.show('验证码格式错误！');
      return;
    }
    this.setState({
      sendDisabled: true,
    });
    this.props.dispatch({
      type: 'card/sendSmsCode',
      payload: {type: 'debit'}
    });
  }

  submit = () => {
    const { dispatch } = this.props;
    // console.log(this.props.form)

    // dispatch({
    //   type: 'card/bindDebit',
    //   payload: {info: 'submit'}
    // });
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

    dispatch({
      type: 'card/cacheDebitInfo',
      payload: {}
    });

    dispatch(routerRedux.push({
      pathname: '/uploadId'
    }));
  }

  renderAlertIcon = (tag) => {
    const { getFieldError } = this.props.form;
    return getFieldError(tag) ?  <Icon size='sm' color='#ff0000' type={'cross-circle-o'} /> : <Icon size='sm' color="#008000" type={'check-circle'} />;
  }

  agreeProto = () => {
    let gray = '#8C8C9E', blue = '#1890ff';
    this.setState({
      agreeColor: this.state.agreeColor === blue ? gray: blue
    })
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const creditInfo = this.props.debitInfo || {};
    return (
      <Layout title={'实名认证'}>
        <div className={styles.normal}>
          <WhiteSpace />
          <List renderHeader={() => '为保证您的账户安全，请完成验证'}>
            <InputItem
              {...getFieldProps('realName', {
                initialValue: creditInfo.realName,
                rules: [{
                  required: true,
                }],
              })}
              error={!!getFieldError('realName')}
              type="text"
              placeholder="请输入真实姓名"
            >姓名</InputItem>
            <InputItem
              {...getFieldProps('idCardNo', {
                initialValue: creditInfo.idCardNo,
                rules: [{
                  required: true,
                }],
              })}
              error={!!getFieldError('idCardNo')}
              type="text"
              placeholder="请输入身份证号"
            >身份证</InputItem>
            <InputItem
            {...getFieldProps('bankCard',{
              initialValue: creditInfo.bankCard,
              rules: [{
                required: true,
                validator: (rule, value, cb) => {
                  if(value.length < 10 || value.length > 28) {
                    cb(new Error('银行卡号格式错误'));
                  } else {
                    cb();
                  }
                }
              }],
            })}
            error={!!getFieldError('bankCard')}
            maxLength={26}
            placeholder={'请输入借记卡卡号'}
            type="bankCard"
          >银行卡</InputItem>
        </List>
        <WhiteSpace />
        <List>
          <InputItem
            {...getFieldProps('phoneNumber', {
              initialValue: creditInfo.phoneNumber,
              rules: [{
                required: true,
                validator: (rule, value, cb) => {
                  if(value.length < 6) {
                    cb(new Error('手机格式错误'))
                  } else {
                    cb();
                  }
                }
              }],
            })}
            error={!!getFieldError('phoneNumber')}
            type="phone"
            placeholder="请输入银行卡预留手机号"
          >预留手机号</InputItem>
          <InputItem
            type="number"
            {...getFieldProps('smsCode', {
              initialValue: creditInfo.smsCode,
              rules: [{
                required: true,
                validator: (rule, value, cb) => {
                  value && value.length >3 && value.length <7 ? cb():cb(new Error('验证码格式错误'))
                }
              }],
            })}
            maxLength={6}
            placeholder="请输入验证码"
            error={!!getFieldError('smsCode')}
            extra={<Button
                    disabled={this.state.sendDisabled}
                    onClick={this.getCode}
                    inline
                    className={styles.getSmsCode}
                    type="primary">{this.state.smsInfo || ''}</Button>}
          >验证码</InputItem>
        </List>
        <WhiteSpace />
        <List renderHeader={() => '请设置支付密码'}>
          <InputItem
            {...getFieldProps('password', {
              initialValue: '',
              rules: [{
                required: true,
              }],
            })}
            error={!!getFieldError('password')}
            placeholder="请设置支付密码"
            type="password"
          >支付密码</InputItem>

          <InputItem
            {...getFieldProps('confirmPassword', {
              initialValue: '',
              rules: [{
                required: true,
              }],
            })}
            error={!!getFieldError('confirmPassword')}
            placeholder="请确认支付密码"
            type="password"
          >确认密码</InputItem>
        </List>


          <Flex className={styles.userProto}>
              <Icon onClick={this.agreeProto} type="check-circle-o" color={this.state.agreeColor} size={'xs'} /><span className={styles.agree} >同意</span><span className={styles.agreeUserProto} >《 用户协议 》</span>
          </Flex>

          <Flex style={{marginTop: '51px'}}>
            <Flex.Item>
              <Button onClick={this.submit} className={styles.nextStep}>下一步</Button>
            </Flex.Item>
          </Flex>
        </div>
      </Layout>
    );
  }
}

AddDebitCard.propTypes = {
  form: PropTypes.object
};

function mapStateToProps(state) {
  const { info } = state.user;

  return {
    info,
    debitSmsSend: state.card.debitSmsSend,
    debitInfo: state.card.debitInfo
  }
}


const AddDebitCardForm = createForm({
  onValuesChange(props, value) {
    console.log('onvalueChange...', value);
    if(value && (value.bankCard || value.phoneNumber)) {
      let val = value.bankCard || value.phoneNumber;
      val = val.replace(/\s/g, '');

      let obj = value.bankCard? {bankCard: val} : {phoneNumber: val};
      props.dispatch({
        type: 'card/savedDebitFields',
        payload: obj
      });
      return;
    }
    props.dispatch({
      type: 'card/savedDebitFields',
      payload: value,
    });
  },
})(AddDebitCard);

export default connect(mapStateToProps)(AddDebitCardForm);
