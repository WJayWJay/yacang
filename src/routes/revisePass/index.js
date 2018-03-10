import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Flex, List, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';

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
    let errors = [];
    this.props.form.validateFields((error, values) => {
      if(error) {
        errors.push(error);
        return ;
      }
    });

    if(errors.length > 0) {
      console.log(errors)
      return;
    }

    dispatch({
      type: 'card/revisePassword',
      payload: {}
    });
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <Layout title={'修改支付密码'}>
        <div className={styles.normal}>
          <div className={styles.content}>
            <Flex direction="column">
              <List renderHeader={() => '为保证您的账户安全，请完成验证'} className={styles.myList}>
                <InputItem
                  clear
                  {...getFieldProps('oldPassword', {
                    initialValue: '',
                    rules: [{
                      required: true,
                    }],
                  })}
                  type={'password'}
                  error={!!getFieldError('oldPassword')}
                  style={{fontSize: '16px',opacity: 0.5, color: '#16153A'}}
                  placeholder="请输入旧支付密码"
                  ref={el => this.autoFocusInst = el}
                >旧密码</InputItem>
                <InputItem
                  clear
                  {...getFieldProps('newPassword', {
                    initialValue: '',
                    rules: [{
                      required: true,
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
                      required: true,
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
  const { info } = state.user;

  return {
    info,
    passwords: state.card.passwords
  }
}

const ReviseIndex = createForm({
  onValuesChange(props, value) {
    props.dispatch({
      type: 'card/modifyPassword',
      payload: value,
    });
  },
})(Index);


export default connect(mapStateToProps)(ReviseIndex);
