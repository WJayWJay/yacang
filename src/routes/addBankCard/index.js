import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Flex, InputItem, List , WhiteSpace, Icon, DatePicker, Toast, Modal} from 'antd-mobile';
import { createForm } from 'rc-form';

import Layout from '../../components/layout';
import Protocal from '../../components/protocal';
import Button from '../../components/button';

import styles from './index.less';

class AddBankCard extends React.Component {
  state = {
    hasError: false,
    smsInfo: '获取验证码',
    itime: 60,
    sendDisabled: false,
    agreeColor: '#8C8C9E', 
    agree: true,
  };
  intervId = 0;

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.creditSmsSend, 'jjjjj')
    if(nextProps.creditSmsSend === 0) {
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
          payload: {creditSmsSend: -1}
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
    if(!!getFieldError('phoneNumber')) {
      Toast.show('手机号格式错误！');
      return;
    }
    this.setState({
      sendDisabled: true,
    });
    this.props.dispatch({
      type: 'card/sendSmsCode',
      payload: {type: 'credit'}
    });
  }

  submit = () => {
    const { dispatch } = this.props;
    // console.log(this.props.form)

    // dispatch({
    //   type: 'card/bindDebit',
    //   payload: {info: 'submit'}
    // });
    if(!this.state.agree) {
      Toast.fail('请同意相关协议!');
      return;
    }
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
      type: 'card/cacheCreditInfo',
      payload: {}
    });
    dispatch({
      type: 'card/bindCredit',
      payload: {}
    });
  }

  renderAlertIcon = (tag) => {
    const { getFieldError } = this.props.form;
    return getFieldError(tag) ?  <Icon size='sm' color='#ff0000' type={'cross-circle-o'} /> : <Icon size='sm' color="#008000" type={'check-circle'} />;
  }

  agreeProto = () => {
    let gray = '#8C8C9E', blue = '#1890ff';
    this.setState({
      // agree: this.state.agreeColor === blue ? gray: blue
      agree: !this.state.agree
    })
  }
  
  openProtocal = () => {
    Modal.alert('协议提示', <Protocal />, [
      { text: '确定', onPress: () => console.log('ok') },
    ])
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const creditInfo = this.props.creditInfo || {};
    return (
      <Layout title={'添加银行卡'}>
        <div className={styles.normal}>
          <List renderHeader={() => '请绑定持卡人本人的银行卡'}>
            {/* <InputItem
              {...getFieldProps('realName', {
                initialValue: creditInfo.realName,
                rules: [{
                  required: true,
                }],
              })}
              error={!!getFieldError('realName')}
              type="text"
              placeholder="请输入名字"
            >持卡人</InputItem> */}
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
            placeholder={'请填写银行卡号'}
            type="bankCard"
          >银行卡号</InputItem>

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
            placeholder="请输入预留电话号码"
          >手机号码</InputItem>
          </List>

          <WhiteSpace />

          <List renderHeader={() => '银行卡类型'}>
            {/* <InputItem
              {...getFieldProps('bankType', {
                initialValue: creditInfo.bankType,
                rules: [{
                  required: true,
                }],
              })}
              error={!!getFieldError('bankType')}
              placeholder="信用卡"
              type="text"
            >卡类型</InputItem> */}

            <InputItem
              {...getFieldProps('cvv2', {
                initialValue: creditInfo.cvv2,
                rules: [{
                  required: true,
                }],
              })}
              error={!!getFieldError('cvv2')}
              placeholder="请填写银行卡校验码(CVV2)"
              type="text"
            >校验码</InputItem>
          
            <InputItem
              {...getFieldProps('validDate', {
                initialValue: creditInfo.validDate,
                rules: [{
                  required: true,
                  validator: (rule, value, cb) => {
                      if (value && value.length !== 4) {
                        cb(new Error('有效期为4位!'))
                      } else {
                        cb();
                      }
                    }
                }],
              })}
              error={!!getFieldError('validDate')}
              placeholder="请填写银行卡有效期(MMYY)"
              type="text"
            >有效期</InputItem>

            {/* <DatePicker
              mode="date"
              title="请选择有效期"
              {...getFieldProps('validDate', {
                initialValue: this.state.dpValue,
                rules: [
                  { required: true, message: 'Must select a date' },
                  { validator: this.validateDatePicker },
                ],
              })}
              onChange={date => console.log(date)}
            >
              <List.Item arrow="horizontal">有效期</List.Item>
            </DatePicker> */}

            

            <InputItem
              type="number"
              {...getFieldProps('smsCode', {
                initialValue: creditInfo.smsCode,
                rules: [{
                  required: true,
                  validator: (rule, value, cb) => {
                    value && value.length >5 && value.length <7 ? cb():cb(new Error('验证码格式错误'))
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
          

          <Flex className={styles.userProto}>
              <Icon onClick={this.agreeProto} type="check-circle-o" color={this.state.agree? '#1890ff': '#8C8C9E'} size={'xs'} /><span onClick={this.agreeProto} className={styles.agree} >同意</span><span onClick={this.openProtocal} className={styles.agreeUserProto} >《 用户协议 》</span>
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

AddBankCard.propTypes = {
  form: PropTypes.object
};

function mapStateToProps(state) {
  const { info } = state.user;
  console.log(state.card.creditSmsSend)

  return {
    info,
    creditSmsSend: state.card.creditSmsSend,
    creditInfo: state.card.creditInfo
  }
}


const AddBankCardForm = createForm({
  onValuesChange(props, value) {
    console.log('onvalueChange...', value);
    if(value && (value.bankCard || value.phoneNumber)) {
      let val = value.bankCard || value.phoneNumber;
      val = val.replace(/\s/g, '');

      let obj = value.bankCard? {bankCard: val} : {phoneNumber: val};
      console.log(obj)
      props.dispatch({
        type: 'card/savedCreditFields',
        payload: obj
      });
      return;
    }
    props.dispatch({
      type: 'card/savedCreditFields',
      payload: value,
    });
  },
})(AddBankCard);

export default connect(mapStateToProps)(AddBankCardForm);
