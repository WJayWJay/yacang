import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
// import { routerRedux } from 'dva/router';
import { Flex, List, Toast, Modal, Icon } from 'antd-mobile';
import { createForm } from 'rc-form';
// import Spinner from '../../components/Spinner';

import { transformFileToDataUrl, compress, processData } from '../../functions';

import Layout from '../../components/layout';
import Button from '../../components/button';

import { getFileValueProps, getValueFromFileEvent } from '../../functions';

import styles from './index.less';

const Item = List.Item;
const imgTypes = ['idCard', 'idCardOpposite', 'idCardTwo', 'bankCard'];

class AddBankCard extends React.Component {
  state = {
    hasError: false,
    smsInfo: '获取验证码',
    itime: 60,
    sendDisabled: false,
    agreeColor: '#8C8C9E',
  };
  inputFiles = {};

  componentDidMount() {

  }

  submit = () => {
    const { dispatch, imageStatus } = this.props;

    let errors = [];
    imgTypes.forEach(element => {
      if (!imageStatus[element]) {
        errors.push(element);
      }
    });
    if (errors[0]) {
      let err = '未知错误!';
      switch (errors[0]) {
        case 'idCard':
          err = '您的身份证正面照还未上传呢。。。';
          Toast.fail(err);
          return;
          break;
        case 'idCardOpposite':
          err = '您的身份证反面照还未上传呢。。。';

          Toast.fail(err);
          return;
          break;
      }
    }

    // dispatch({
    //   type: 'card/bindDebit',
    //   payload: {}
    // });
    dispatch(routerRedux.push({
      pathname: '/addDebit'
    }));
  }

  toUpload = (e, item) => {
    // console.log(e.target, e);
    const fileRef = this.props.form.getFieldInstance('attachment' + item.id);
    // console.log(fileRef)
    if (fileRef) {
      // fileRef.click();
      fileRef.click();
    }
  }

  checkSize = (rule, value, callback) => {
    const size = 1024 * 1024 * 5;
    // console.log(value, 'jjj')
    if (value && value.target) {
      const files = value.target.files;
      if (files[0]) {
        var err = '';
        if (files[0].size > size) {
          err = '图片文件过大，请上传不大于512kb的图片！';
          Toast.fail(err);
        } else if (files[0].type.indexOf('image') === -1) {
          err = '不支持的类型';
          Toast.fail(err);
        }
        callback(err || undefined);
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  renderModal = (item) => {
    const { uploadTypes } = this.props;
    const currentTag = uploadTypes[item.tag];
    return (<Modal
      visible={currentTag || false}
      transparent
      maskClosable={false}
      onClose={() => { }}
      title="资料上传中"
      // footer={[{ text: '', onPress: () => { console.log('ok'); } }]}
      wrapProps={{ onTouchStart: this.onWrapTouchStart }}
    >
      <div style={{ padding: '10px 0' }}>
        {item.title} 上传中...
        </div>
        <div>
          <Icon type={'loading'} />
        </div>
    </Modal>);
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { creditInfo, imageStatus } = this.props;
    const listInfo = [
      { id: 0, title: '身份证正面', needs: true, subTitle: '', extra: '', imageCategory: '0003', tag: 'idCard' },
      { id: 1, title: '身份证反面', needs: true, subTitle: '请上传身份证反面', extra: '', imageCategory: '0004', tag: 'idCardOpposite' },
      { id: 2, title: '手持身份证', subTitle: '请上传手持身份证正面', extra: '', imageCategory: '0005', tag: 'idCardTwo' },
      { id: 3, title: '银行卡正面', subTitle: '请上传银行卡正面', extra: '', imageCategory: '0006', tag: 'bankCard' },
    ];

    return (
      <Layout title={'实名认证'}>
        {/* <Spinner loading={true} /> */}
        <div className={styles.normal}>
          <List renderHeader={() => '请上传认证图片(图片不大于512kb,* 表示必须上传)'}>
            {
              listInfo.map((item) => {
                return (<div key={item.title} >
                  <Item
                    className={[styles.listItem, 'needsclick']}
                    key={item.title}
                    arrow="horizontal"
                    extra={(imageStatus[item.tag] | 0) > 0 ? <span style={{ 'color': 'red' }}>已上传</span> : null}
                    onClick={(e) => { this.toUpload(e, item) }}
                  >
                    {this.renderModal(item)}
                    <span className={styles.title}>{item.title}{item.needs && (<span style={{ color: 'red' }}>*</span>)}</span>
                    <span className={styles.title + ' ' + styles.subTitle}>{item.subTitle}</span>
                    <div className={[styles.hidden + ' needsclick']}></div>
                  </Item>
                  <input className='needsclick' accept="image/*" style={{ display: 'none' }} type="file"
                    {...getFieldProps('attachment' + item.id, {
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


          <Flex style={{ marginTop: '51px' }}>
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
  let imgLoading = state.loading.effects['card/cardImageUpload'];
  return {
    info,
    imgLoading,
    uploadTypes: state.card.uploadTypes,
    // loading: state.loading.global,     
    creditInfo: state.card.creditInfo,
    imageStatus: state.card.imageStatus
  }
}


const AddBankCardForm = createForm({
  onValuesChange: (props, value) => {
    // console.log(value, 'change');
    let type = '';
    const fileData = new FormData();
    let imgFile = null;
    let imageCategory = '';
    if (value['attachment0']) {
      type = imgTypes[0];
      imgFile = value['attachment0'].target.files[0];
      imageCategory = '0003';

      // fileData.append('imageFile', value['attachment0'].target.files[0]);
      // fileData.append('imageCategory', '0003');
    } else if (value['attachment1']) {
      type = imgTypes[1];
      // fileData.append('imageFile', value['attachment1'].target.files[0]);
      // fileData.append('imageCategory', '0004');

      imgFile = value['attachment1'].target.files[0];
      imageCategory = '0004';
    } else if (value['attachment2']) {
      type = imgTypes[2];
      // fileData.append('imageFile', value['attachment2'].target.files[0]);
      // fileData.append('imageCategory', '0005');

      imgFile = value['attachment2'].target.files[0];
      imageCategory = '0005';
    } else if (value['attachment3']) {
      type = imgTypes[3];
      // fileData.append('imageFile', value['attachment3'].target.files[0]);
      // fileData.append('imageCategory', '0006');

      imgFile = value['attachment3'].target.files[0];
      imageCategory = '0006';
    } else {
      Toast.fail('应用出现了点问题，请联系管理员！');
      return;
    }

    fileData.append('imageCategory', imageCategory);
    if (!imgFile) return;
    transformFileToDataUrl(imgFile)
      .then(compressDataUrl => {
        return processData(compressDataUrl, imgFile).then(fileBlob => {
          // console.log(fileBlob, 'fileBlob222222')
          return fileBlob;
        })
      }).then(fileBlob => {
        fileData.append('imageFile', fileBlob);
        // fileData.append('imageCategory', '0003');
        props.dispatch({
          type: 'card/cardImageUpload',
          payload: { formData: fileData, type: type }
        });
      })
    return;
    // props.dispatch({
    //   type: 'card/cardImageUpload',
    //   payload: {formData: fileData, type: type}
    // })
  }
})(AddBankCard);

export default connect(mapStateToProps)(AddBankCardForm);
