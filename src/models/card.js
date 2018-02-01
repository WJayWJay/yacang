import { bindCreditCard, listCard, bindCardDebit } from '../services/card';
// import pathToRegexp from 'path-to-regexp';
import Cache from '../utils/cache';

const homeSwiperKey = 'homeSwiperKey@cache';

export default {

  namespace: 'card',

  state: {
    creditInfo: {
      bankCard: '',
      phoneNumber: '',
      cvv2: '', 
      validDate: '',
      smsCode: ''
    },
    debitInfo: {
      realName: '',
      bankCard: '',
      idCardNo: '',
      phoneNumber: '',
      password: '', 
      confirmPassword: '',
      smsCode: ''
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      
    },
  },

  effects: {
    *fetch({ payload: { type } }, { call, put, select}) {  // eslint-disable-line
      if (type === 'img') {
        let dataSwiper = Cache.get(homeSwiperKey);
        if(dataSwiper) {
          yield put({
            type: 'updateState',
            payload: {swiperList: dataSwiper}
          });
        }
      }
      const { data } = yield call(listCard, {type: type});
      
      if( data && data['success'] && data['result'] ) {
        let payload = {};
        payload = type === 'msg' ? {tagList: data.result} : type === 'img' ? {swiperList: data.result}: {}
        yield put({
          type: 'updateState',
          payload: payload
        });
        if (type === 'img') {
          Cache.set(homeSwiperKey, data.result);
        }
      }
    },
    *bindCredit({ payload: info }, { call, put, select}) {
      let creditInfo = yield select(state => state.card.creditInfo);
      console.log(creditInfo)
      const { data } = yield call(bindCreditCard, creditInfo);
      console.log( data , 'bindcre')
      if(data && data['success']) {

      } else {
        
      }

    },
    *bindDebit({ payload: info }, { call, put, select}) {
      let debitInfo = yield select(state => state.card.debitInfo);
      console.log(debitInfo)
      const { data } = yield call(bindCardDebit, debitInfo);
      console.log( data , 'debit')
      if(data && data['success']) {

      } else {
        
      }

    }
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    savedFields(state, { payload }) {
      return { ...state, ...{creditInfo: {...state.creditInfo, ...payload} } };
    },
    savedDebitFields(state, { payload }) {
      return { ...state, ...{debitInfo: {...state.debitInfo, ...payload} } };
    },
    
  },

};
