import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Flex, InputItem, List , WhiteSpace, Icon, DatePicker, Toast} from 'antd-mobile';
import { createForm } from 'rc-form';

import Layout from '../../components/layout';
import Button from '../../components/button';

import { getFileValueProps, getValueFromFileEvent } from '../../functions';

import styles from './index.less';

const Item = List.Item;
const imgTypes = ['idCard','idCardOpposite', 'idCardTwo', 'bankCard'];

class AddBankCard extends React.Component {
  state = {
    hasError: false,
    smsInfo: '获取验证码',
    itime: 60,
    sendDisabled: false,
    agreeColor: '#8C8C9E',
  };
  inputFiles = {};

  submit = () => {
    const { dispatch, imageStatus } = this.props;

    let errors = [];
    imgTypes.forEach(element => {
      if(!imageStatus[element]) {
        errors.push(element);
      }
    });
    if(errors[0]) {
      let err = '未知错误!';
      switch (errors[0]) {
        case 'idCard':
          err = '您的身份证正面照还未上传呢。。。';
          break;
        case 'idCardOpposite':
          err = '您的身份证反面照还未上传呢。。。';
          break;
        case 'idCardTwo':
          err = '您的手持身份证照还未上传呢。。。';
          break;
        case 'bankCard':
          err = '您的银行卡正面照还未上传呢。。。';
          break;

        default:
          err = '未知错误!';
          break;
      }
      Toast.fail(err);
      return;
    }

    dispatch({
      type: 'card/bindDebit',
      payload: {}
    });
  }

  toUpload = (e, item) => {
    console.log(item)
    let fileRef = this.props.form.getFieldInstance('attachment'+ item.id);
    if(fileRef) {
      fileRef.click();
    }
  }

  checkSize = (rule, value, callback) => {
    if (value && value.target) {
      const files = value.target.files;
      if (files[0]) {
        if(files[0].size > 10000000) {
          Toast.fail('图片文件过大，请重新上传');
        }
        callback(files[0].size > 10000000 ? 'file size must be less than 10M' : undefined);
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const {creditInfo, imageStatus} = this.props;
    const listInfo= [
      {id: 0, title: '身份证正面', subTitle: '', extra: '', imageCategory: '0003', tag: 'idCard' },
      {id: 1, title: '身份证反面', subTitle: '请上传身份证反面', extra: '', imageCategory: '0004', tag: 'idCardOpposite' },
      {id: 2, title: '手持身份证', subTitle: '请上传手持身份证正面', extra: '', imageCategory: '0005', tag: 'idCardTwo' },
      {id: 3, title: '银行卡正面', subTitle: '请上传银行卡正面', extra: '', imageCategory: '0006', tag: 'bankCard' },
    ];

    return (
      <Layout title={'实名认证'}>
        <div className={styles.normal}>
          <List renderHeader={() => '请上传认证图片'}>
            {
              listInfo.map((item) => {
                return (<div key={item.title}>
                  <Item
                    className={styles.listItem}
                    key={item.title}
                    arrow="horizontal"
                    extra={(imageStatus[item.tag] | 0) > 0 ? '已上传': ''}
                    onClick={(e) => { this.toUpload(e, item) }}
                  >
                    <span className={styles.title}>{item.title}</span>
                    <span className={styles.title + ' ' +styles.subTitle}>{item.subTitle}</span>
                  </Item>
                  <input className={'needsClick'} accept="image/*" style={{display: "none"}} type="file"
                    {...getFieldProps('attachment'+item.id, {
                      initialValue: '',
                      getValueProps: getFileValueProps,
                      ref: (ref) => {
                        this.inputFiles[item.tag] = ref;
                      },
                      getValueFromEvent: getValueFromFileEvent,
                      rules: [this.checkSize],
                  })}
                  />
                </div>)
              })
            }
          </List>


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
    creditInfo: state.card.creditInfo,
    imageStatus: state.card.imageStatus
  }
}

const AddBankCardForm = createForm({
  onValuesChange: (props, value) => {
    console.log(value, 'change');
    let type = '';
    const fileData = new FormData();
    if(value['attachment0']) {
      type = imgTypes[0];
      fileData.append('imageFile', value['attachment0'].target.files[0]);
      fileData.append('imageCategory', '0003');
    } else if(value['attachment1']) {
      type = imgTypes[1];
      fileData.append('imageFile', value['attachment1'].target.files[0]);
      fileData.append('imageCategory', '0004');
    } else if(value['attachment2']) {
      type = imgTypes[2];
      fileData.append('imageFile', value['attachment2'].target.files[0]);
      fileData.append('imageCategory', '0005');
    } else if(value['attachment3']) {
      type = imgTypes[3];
      fileData.append('imageFile', value['attachment3'].target.files[0]);
      fileData.append('imageCategory', '0006');
    } else {
      Toast.fail('应用出现了点问题，请联系管理员！');
      return;
    }

    props.dispatch({
      type: 'card/cardImageUpload',
      payload: {formData: fileData, type: type}
    })
  }
})(AddBankCard);

export default connect(mapStateToProps)(AddBankCardForm);
