import {
  bindCreditCard, listCard,
  bindCardDebit, sendCreditSmsCode,
  imageUpload, revisePass,
  dualMsgService, sellteTypeService,
  quickDualService, applyDebitSmsService
} from '../services/card';
import md5 from 'js-md5';
// import fetch from 'dva/fetch';

// import pathToRegexp from 'path-to-regexp';
import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import Cache from '../utils/cache';

const creditInfoKey = 'creditInfoKey@cache';
const debitInfoKey = 'debitInfoKey@cache';

export default {

  namespace: 'card',

  state: {
    cardList: [],
    creditInfo: {
      bankCard: '',
      phoneNumber: '',
      cvv2: '',
      validDate: '',
      smsCode: ''
    },
    creditSmsSend: -1,
    debitSmsSend: -1,
    debitInfo: {
      realName: '',
      bankCard: '',
      idCardNo: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      smsCode: ''
    },
    imageStatus: {

    },
    imageSrc: {

    },
    passwords: {},
    channelResultNo: '',
    sellteType: [],
    uploadTypes: {

    }
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        if (['/checkcode', '/addBankCard'].indexOf(location.pathname) > -1) {
          let data = Cache.get(creditInfoKey);
          if (data) {
            dispatch({
              type: 'savedCreditFields',
              payload: { ...data }
            });
          }
        }
      })
    },
  },

  effects: {
    *sendSmsCode({ payload: { type } }, { call, put, select }) {  // eslint-disable-line

      let bankCard = '';
      let phoneNumber = '';
      let serviceApi = '';
      if (type === 'credit') {
        const creditInfo = yield select(state => state.card.creditInfo);
        bankCard = creditInfo.bankCard;
        phoneNumber = creditInfo.phoneNumber;
        serviceApi = sendCreditSmsCode;
      } else if (type === 'debit') {
        const debitInfo = yield select(state => state.card.debitInfo);
        bankCard = debitInfo.bankCard;
        phoneNumber = debitInfo.phoneNumber;
        serviceApi = applyDebitSmsService;
      } else {
        return;
      }
      const { data } = yield call(serviceApi, { bankCard: bankCard, phoneNumber: phoneNumber });
      let payload = {};
      let key = type === 'credit' ? 'creditSmsSend' : 'debitSmsSend';
      if (data && data['success']) {
        Toast.success('短信验证码已发送，请注意查收!');
        payload[key] = 0
        yield put({
          type: 'updateState',
          payload: payload
        })
      } else {
        Toast.fail(data.errorMsg || '');
        let smsData = yield select(state => state.card[key]);
        payload[key] = smsData + 3
        yield put({
          type: 'updateState',
          payload: payload
        })
      }
    },
    *fetchCard({ payload: { type } }, { call, put, select }) {  // eslint-disable-line
      const isLogin = yield select(s => s.user.isLogin);
      if (!isLogin) return;
      const { data } = yield call(listCard, {});
      if (data && data['success'] && data['result']) {
        yield put({
          type: 'updateState',
          payload: { cardList: data['result'] }
        });
        if (type === 'reposit') {
          const tradeInfo = yield select(s => s.trade.tradeInfo);
          let first = data['result'];
          first = Array.isArray(first) && first.filter(items => items.bankCardType === '信用卡');
          if (first && first.length) {
            let item = first[0];
            if (tradeInfo.bankCardID) {
              return;
            }
            yield put({
              type: 'trade/updateTradeInfo',
              payload: { bankCardID: item.id, phoneNumber: item.phoneNumber }
            });
            yield put({
              type: 'trade/updateCreditInfo',
              payload: { ...item }
            });
          }
        }
      }
    },
    *bindCredit({ payload: info }, { call, put, select }) {
      let creditInfo = yield select(state => state.card.creditInfo);
      const { data } = yield call(bindCreditCard, creditInfo);
      if (data && data['success']) {
        Toast.success('绑定成功!');
        yield put(routerRedux.push({
          pathname: '/cardCenter'
        }));
      } else {
        Toast.fail(data.errorMsg || '');
      }
    },
    *bindDebit({ payload: info }, { call, put, select }) {
      let debitInfo = yield select(state => state.card.debitInfo);

      const { data } = yield call(bindCardDebit, Object.assign({}, debitInfo, {
        password: md5(debitInfo.password),
        confirmPassword: md5(debitInfo.confirmPassword)
      }));
      if (data && data['success']) {
        Toast.success('绑定成功!');
        yield put(routerRedux.push({
          // pathname: '/cardCenter'
          pathname: '/result'
        }));
      } else {
        Toast.fail(data.errorMsg || '绑定失败');
      }
    },
    *cacheCreditInfo({ payload: info }, { call, put, select }) {
      const creditInfo = yield select(state => state.card.creditInfo);
      Cache.set(creditInfoKey, creditInfo);
    },
    *cacheDebitInfo({ payload: info }, { call, put, select }) {
      const debitInfo = yield select(state => state.card.debitInfo);
      Cache.set(debitInfoKey, debitInfo);
    },
    *cardImageUpload({ payload: { formData, type } }, { call, put, select }) {

      // -1 0 1
      yield put({
        type: 'updateUploadTypes',
        payload: {
          [type]: 1
        }
      });
      console.log(type)
      const imageStatus = yield select(state => state.card.imageStatus);
      const { data } = yield call(imageUpload, formData);

      // fetch()


      if (!data) {
        yield put({
          type: 'updateUploadTypes',
          payload: {
            [type]: 0
          }
        });
        return;
      }
      // Toast.fail('data'+ JSON.stringify(data))
      if (data && data['success']) {
        Toast.success('图片上传成功!');
        let currentImgStatus = imageStatus[type] | 0;
        yield put({
          type: 'updateImgStatus',
          payload: {
            [type]: ++currentImgStatus
          }
        });
        yield put({
          type: 'updateImgSrc',
          payload: {
            [type]: data.result['imageUrl']
          }
        });
      } else {
        Toast.fail(data && data.errorMsg || '上传图片错误！');
      }
      yield put({
        type: 'updateUploadTypes',
        payload: {
          [type]: 0
        }
      });
    },

    *revisePassword({ payload: { }}, { call, put, select }) {
      const passwords = yield select(state => state.card.passwords);
      const { data } = yield call(revisePass, {
        oldPassword: md5(passwords.oldPassword),
        newPassword: md5(passwords.newPassword),
        configPassword: md5(passwords.configPassword),
      });
      if (data && data['success']) {
        Toast.success('支付密码修改成功！');
        yield put(routerRedux.push({
          pathname: '/userinfo',
        }));
        yield put({
          type: 'modifyPassword',
          payload: {
            newPassword: '',
            oldPassword: '',
            configPassword: ''
          }
        });
      } else {
        if (data.errorCode === 'DHT_0014') {
          Toast.success('原密码输入错误!');
          return;
        }
        Toast.success(data.errorMsg || '');
      }
    },
    *getSellteType({ payload }, { call, put, select }) {
      const { data } = yield call(sellteTypeService, payload);
      if (data && data['success']) {
        yield put({
          type: 'updateState',
          payload: {
            sellteType: data.result,
          }
        });
      } else {
        Toast.success(data.errorMsg || '');
      }
    },
    // quick pay 快捷支付(申请交易短信)
    *applyDualMsg({ payload }, { call, put, select }) {
      const { data } = yield call(dualMsgService, payload);
      if (data && data['success']) {
        Toast.success('交易短信获取成功！');
        // yield put(routerRedux.push({
        //   pathname: '/userinfo',
        // }));
        yield put({
          type: 'updateState',
          payload: {
            channelResultNo: data.result.channelResultNo,
          }
        });
      } else {
        Toast.success(data.errorMsg || '');
      }
    },
    // quick pay  快捷支付(提交交易)
    *quickDual({ payload }, { call, put, select }) {
      // const passwords = yield select(state => state.card.passwords);
      const { data } = yield call(quickDualService, payload);
      if (data && data['success']) {
        Toast.success('交易成功！');
        // yield put(routerRedux.push({
        //   pathname: '/userinfo',
        // }));

      } else {
        Toast.success(data.errorMsg || '');
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    modifyPassword(state, { payload }) {
      return { ...state, ...{ passwords: { ...state.passwords, ...payload } } };
    },
    updateImgStatus(state, { payload }) {
      return { ...state, ...{ imageStatus: { ...state.imageStatus, ...payload } } };
    },
    updateImgSrc(state, { payload }) {
      return { ...state, ...{ imageSrc: { ...state.imageSrc, ...payload } } };
    },
    savedCreditFields(state, { payload }) {
      return { ...state, ...{ creditInfo: { ...state.creditInfo, ...payload } } };
    },
    savedDebitFields(state, { payload }) {
      return { ...state, ...{ debitInfo: { ...state.debitInfo, ...payload } } };
    },
    updateUploadTypes(state, { payload }) {
      return { ...state, ...{ uploadTypes: { ...state.uploadTypes, ...payload } } };
    },

  },

};
