import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Flex, InputItem, Button,List } from 'antd-mobile';

import {createForm} from 'rc-form'

import Layout from '../../components/layout';

import styles from './index.less';

class CheckCode extends React.Component {
  state = {
    hasError: false,
    value: '',
    sendDisabled: false
  }
  onErrorClick = () => {
    if (this.state.hasError) {
      // Toast.info('Please enter 11 digits');
    }
  }

  getCode = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;

    dispatch({
      type: 'card/sendSmsCode',
      payload: {}
    });
    this.setState({
      sendDisabled: true
    })
  }

  render() {
    const { creditInfo } = this.props;
    const { getFieldProps, getFieldError } = this.props.form;
    let error = !!getFieldError('smsCode');

    return (
      <Layout>
        <div className={styles.normal}>
          <Flex direction="column">
            <Flex.Item className={styles.item}>
              <span>
                绑定银行卡需要短信确认，验证码已发送至手机：{creditInfo.phoneNumber || ''}，请按提示操作。
              </span>
            </Flex.Item>

            <Flex.Item className={[styles.item, styles.itemAddtion]}>
              <Flex>
                <Flex.Item className={styles.itemLeft}>
                  <List>
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
                      placeholder="请填写验证码"
                      error={error}
                    ></InputItem>
                  </List>
                </Flex.Item>
                <Flex.Item className={styles.itemRight}>
                  <Button disabled={this.state.sendDisabled} onClick={this.getCode} inline className={styles.getCheckButton} type="primary">获取验证码</Button>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item className={[styles.item, styles.nextStepCon]}>
              <Button className={styles.nextStep} type="primary">下一步</Button>
            </Flex.Item>

          </Flex>
        </div>
      </Layout>
    );
  }
}

CheckCode.propTypes = {
};

function mapStateToProps(state) {
  const { info } = state.user;
  console.log(state.card.creditInfo)
  return {
    info,
    creditInfo: state.card.creditInfo
  }
}

export default connect(mapStateToProps)(createForm({
  onValuesChange(props, value) {
    props.dispatch({
      type: 'card/savedCreditFields',
      payload: value,
    });
  }
})(CheckCode));
