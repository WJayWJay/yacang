import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Flex, List, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import Spinner from '../../components/Spinner'

import Layout from '../../components/layout';
import Button from '../../components/button';

import styles from './index.less';


class Index extends React.Component {
  state = {
    hasError: false,
    value: '',
  }

  submit = (e) => {
    const { dispatch } = this.props;
    let errors = null;
    this.props.form.validateFields((error, values) => {
      // console.log(error, values)
      if(error) {
        errors = error;
        return ;
      }
    });

    if(errors) {
      return;
    }
    dispatch({
      type: 'user/resetPassword',
      payload: {}
    });
  }


  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <Layout title={'修改支付密码'}>
        <Spinner loading={this.props.loading} />
        <div className={styles.normal}>
          <div className={styles.content}>
            <Flex direction="column">
              <List className={styles.myList}>
                <InputItem
                  clear
                  {...getFieldProps('newPassword', {
                    initialValue: '',
                    rules: [{
                      validator: (rule, value, cb) => {
                        if(value.length < 6) {
                          cb(new Error('密码格式错误！'));
                        } else {
                          cb();
                        }
                      }
                    }],
                  })}
                  type={'password'}
                  error={!!getFieldError('newPassword')}
                  style={{fontSize: '16px',opacity: 0.5, color: '#16153A'}}
                  placeholder="请输入新支付密码"
                >新密码</InputItem>
                <InputItem
                  clear
                  {...getFieldProps('configPassword', {
                    initialValue: '',
                    rules: [{
                      validator: (rule, value, cb) => {
                        if(value.length < 6) {
                          cb(new Error('密码格式错误！'));
                        } else {
                          cb();
                        }
                      }
                    }],
                  })}
                  type={'password'}
                  error={!!getFieldError('configPassword')}
                  style={{fontSize: '16px',opacity: 0.5, color: '#16153A'}}
                  placeholder="请再次输入新支付密码"
                >确认密码</InputItem>
              </List>
            </Flex>

            <Button onClick={this.submit} className={styles.saveButton}>完成修改</Button>
          </div>
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
};

function mapStateToProps(state) {
  const { info, resetPasswords } = state.user;

  return {
    info,
    resetPasswords,
    loading: state.loading.global || false,
  }
}


const Forget2Form = createForm({
  onValuesChange(props, value) {
    // console.log('onvalueChange...', value);
    props.dispatch({
      type: 'user/resetPasswords',
      payload: value,
    });
  },
})(Index);

export default connect(mapStateToProps)(Forget2Form);
