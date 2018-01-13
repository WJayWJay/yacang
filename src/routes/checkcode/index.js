import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Flex, InputItem, Button,List } from 'antd-mobile';

import Layout from '../../components/layout';

import styles from './index.less';

class CheckCode extends React.Component {
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

  render() {
    console.log(this.props)
    return (
      <Layout>
        <div className={styles.normal}>
          <Flex direction="column">
            <Flex.Item className={styles.item}>
              <span>
                绑定银行卡需要短信确认，验证码已发送至手机：18659504434，请按提示操作。
              </span>
            </Flex.Item>

            <Flex.Item className={[styles.item, styles.itemAddtion]}>
              <Flex>
                <Flex.Item className={styles.itemLeft}>
                  <List>
                    <InputItem
                      type="number"
                      maxLength={6}
                      placeholder="请填写验证码"
                      error={this.state.hasError}
                      onErrorClick={this.onErrorClick}
                      onChange={this.onChange}
                      value={this.state.value}
                    ></InputItem>
                  </List>
                </Flex.Item>
                <Flex.Item className={styles.itemRight}>
                  <Button inline className={styles.getCheckButton} type="primary">获取验证码</Button>
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

export default connect()(CheckCode);
