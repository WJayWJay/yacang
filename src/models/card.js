import { bindCreditCard, listCard, bindCardDebit, sendCreditSmsCode, imageUpload } from '../services/card';
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

    }
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        console.log(location)
        if(['/checkcode', '/addBankCard'].indexOf(location.pathname) > -1) {
          let data = Cache.get(creditInfoKey);
          console.log('cache...',data)
          if(data) {
            dispatch({
              type: 'savedCreditFields',
              payload: {...data}
            });
          }
        }
      })
    },
  },

  effects: {
    *sendSmsCode({ payload: { type } }, { call, put, select}) {  // eslint-disable-line
      
      let bankCard = '';
      let phoneNumber = '';
      if( type === 'credit') {
        const creditInfo = yield select(state => state.card.creditInfo);
        bankCard = creditInfo.bankCard;
        phoneNumber = creditInfo.phoneNumber;
      } else if(type === 'debit') {
        const debitInfo = yield select(state => state.card.debitInfo);
        bankCard = debitInfo.bankCard;
        phoneNumber = debitInfo.phoneNumber;
      } else {
        return;
      }
      const { data } = yield call(sendCreditSmsCode, {bankCard: bankCard, phoneNumber: phoneNumber});
      let payload = {};
      let key = type === 'credit'? 'creditSmsSend': 'debitSmsSend';
      if(data && data['success']) {
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
    *fetchCard({ payload: { type } }, { call, put, select}) {  // eslint-disable-line
      
      const { data } = yield call(listCard, {});
      console.log(data, 'cardList')
      if( data && data['success'] && data['result'] ) {
        yield put({
          type: 'updateState',
          payload: {cardList: data['result']}
        });
      }
    },
    *bindCredit({ payload: info }, { call, put, select}) {
      let creditInfo = yield select(state => state.card.creditInfo);
      console.log(creditInfo)
      const { data } = yield call(bindCreditCard, creditInfo);
      console.log( data , 'bindcre')
      if(data && data['success']) {
        Toast.success('绑定成功!');
        yield put(routerRedux.push({
          pathname: '/cardCenter'
        }));
      } else {
        Toast.fail(data.errorMsg || '');
      }
    },
    *bindDebit({ payload: info }, { call, put, select}) {
      let debitInfo = yield select(state => state.card.debitInfo);
      console.log(debitInfo)
      const { data } = yield call(bindCardDebit, debitInfo);
      console.log( data , 'debit')
      if(data && data['success']) {
        Toast.success('绑定成功!');
        yield put(routerRedux.push({
          pathname: '/cardCenter'
        }));
      } else {
        Toast.fail(data.errorMsg || '');
      }
    },
    *cacheCreditInfo({ payload: info }, { call, put, select}) {
      const creditInfo = yield select(state => state.card.creditInfo);
      console.log('creditInfo***',creditInfo)
      Cache.set(creditInfoKey, creditInfo);
    },
    *cacheDebitInfo({ payload: info }, { call, put, select}) {
      const debitInfo = yield select(state => state.card.debitInfo);
      console.log('info***',debitInfo)
      Cache.set(debitInfoKey, debitInfo);
    },
    *cardImageUpload({ payload: {formData, type} }, { call, put, select}) {
      const imageStatus = yield select(state => state.card.imageStatus);
      const { data } = yield call(imageUpload, formData);
      console.log(data, 'imgupload')

      if(data && data['success']) {
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
        Toast.fail(data.errorMsg || '');
      }
    }
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updateImgStatus(state, { payload }) {
      return { ...state, ...{imageStatus: {...state.imageStatus, ...payload} } };
    },
    updateImgSrc(state, { payload }) {
      return { ...state, ...{imageSrc: {...state.imageSrc, ...payload} } };
    },
    savedCreditFields(state, { payload }) {
      return { ...state, ...{creditInfo: {...state.creditInfo, ...payload} } };
    },
    savedDebitFields(state, { payload }) {
      return { ...state, ...{debitInfo: {...state.debitInfo, ...payload} } };
    },
    
  },

};
