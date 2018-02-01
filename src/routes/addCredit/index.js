import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Flex, InputItem, List , WhiteSpace, Icon} from 'antd-mobile';
import { createForm } from 'rc-form';

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';

class AddBankCard extends React.Component {
  state = {
    hasError: false,
    value: '',
  }
  onErrorClick = () => {
    if (this.state.hasError) {
      // Toast.info('Please enter 11 digits');
    }
  }
  onChange = (value) => {
    if (value.replace(/\s/g, '').length < 11) {
      this.setState({
        hasError: true,
      });
    } else {
      this.setState({
        hasError: false,
      });
    }
    this.setState({
      value,
    });
  }

  submit = () => {
    const { dispatch } = this.props;
    // console.log(this.props.form)

    // dispatch({
    //   type: 'card/bindDebit',
    //   payload: {info: 'submit'}
    // });
    dispatch(routerRedux.push({
      pathname: '/checkcode',
      search: 'type=credit'
    }))
  }
  
  render() {
    const { getFieldProps, getFieldError } = this.props.form;

    console.log(this.props)
    return (
      <Layout title={'添加银行卡'}>
        <div className={styles.normal}>
          <List renderHeader={() => '请绑定持卡人本人的银行卡'}>
            <InputItem
              {...getFieldProps('realName', {
                rules: [{
                  required: true,
                }],
              })}
              extra={<Icon type={getFieldError('realName') ? 'cross': 'check'} />  }
              type="text"
              placeholder="请输入名字"
            >持卡人</InputItem>
            <InputItem
            {...getFieldProps('bankCard',{
              rules: [{
                required: true,
              }],
            })}
            extra={<Icon type={getFieldError('bankCard') ? 'cross': 'check'} />  }
            maxLength={20}
            placeholder={'8888 8888 8888 8888'}
            type="bankCard"
          >银行卡</InputItem>
          </List>

          <WhiteSpace />

          <List renderHeader={() => '银行卡类型'}>
            <InputItem
              {...getFieldProps('bankType', {
                rules: [{
                  required: true,
                }],
              })}
              extra={<Icon type={getFieldError('bankType') ? 'cross': 'check'} />  }
              placeholder="建设银行   储蓄卡"
              type="text"
            >卡类型</InputItem>

            <InputItem
              type="phone"
              placeholder="186 1234 1234"
            >手机号码</InputItem>

            
          </List>
          <Flex className={styles.userProto}>
              <Icon type="check-circle-o" color={'#8C8C9E'} size={'xs'} /><span className={styles.agree} >同意</span><span className={styles.agreeUserProto} >《 用户协议 》</span>
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
  return {
    info,
    debitInfo: state.card.debitInfo
  }
}

const AddBankCardForm = createForm({
  onValuesChange(props, value) {
    console.log('onvalueChange...', value);
    props.dispatch({
      type: 'card/savedDebitFields',
      payload: value,
    });
  },
})(AddBankCard);

export default connect(mapStateToProps)(AddBankCardForm);
