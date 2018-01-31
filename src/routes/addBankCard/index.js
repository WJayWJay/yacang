import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Flex, InputItem, List , WhiteSpace, Icon} from 'antd-mobile';
import { createForm, createFormField } from 'rc-form';

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
    console.log(this.props.form)
  }
  
  render() {
    const { getFieldProps } = this.props.form;

    console.log(this.props)

    return (
      <Layout title={'添加银行卡'}>
        <div className={styles.normal}>
          <List renderHeader={() => '请绑定持卡人本人的银行卡'}>
            <InputItem
              {...getFieldProps('realName')}
              extra="?"
              placeholder="请输入名字"
            >持卡人</InputItem>
            <InputItem
            {...getFieldProps('bankCard')}
            // {...getFieldProps('bankCard', {
            //   initialValue: '8888 8888 8888 8888',
            // })}
            placeholder={'8888 8888 8888 8888'}
            type="bankCard"
          >银行卡</InputItem>
          </List>

          <WhiteSpace />

          <List renderHeader={() => '银行卡类型'}>
            <InputItem
              {...getFieldProps('bankType')}
              placeholder="建设银行   储蓄卡"
              ref={el => this.autoFocusInst = el}
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
};

function mapStateToProps(state) {
  const { info } = state.user;
  return {
    info,
    creditInfo: state.card.creditInfo
  }
}

const AddBankCardForm = createForm({
  mapPropsToFields(props) {
    console.log('mapPropsToFields', props);
    return {
      bankCard: createFormField(props.creditInfo.bankCard),
      phoneNumber: createFormField(props.creditInfo.phoneNumber),
      cvv2: createFormField(props.creditInfo.cvv2),
      validDate: createFormField(props.creditInfo.validDate),
      smsCode: createFormField(props.creditInfo.smsCode)
    };
  },
  onFieldsChange(props, fields) {
    console.log('onFieldsChange...', fields);
    props.dispatch({
      type: 'card/saveFields',
      payload: fields,
    });
  },
})(AddBankCard);

export default connect(mapStateToProps)(AddBankCardForm);
