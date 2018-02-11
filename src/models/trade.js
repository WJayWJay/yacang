import { listCard,
   bindCardDebit, sendCreditSmsCode,
   imageUpload, revisePass,
   dualMsgService, sellteTypeService,
   quickDualService
} from '../services/card';

// import pathToRegexp from 'path-to-regexp';
import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import Cache from '../utils/cache';

const creditInfoKey = 'creditInfoKey@cache';
const debitInfoKey = 'debitInfoKey@cache';

export default {

  namespace: 'trade',

  state: {
    tradeSmsSend: -1,
    tradeInfo: {
      settleType: '',
      bankCardID: '',
      phoneNumber: '',
      smsCode: '',
      password:'',
      msgType: '002'
    },
    creditInfo: {},
    channelResultNo: '',
    sellteType: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        console.log(location)
        if(['/checkcode', '/addBankCard'].indexOf(location.pathname) > -1) {
          let data = Cache.get(creditInfoKey);
          console.log('cache...',data)
          if(data) {
          }
        }
      })
    },
  },

  effects: {
    *sendSmsCode({ payload: { type } }, { call, put, select}) {  // eslint-disable-line

      let bankCard = '';
      let phoneNumber = '';

      const tradeInfo = yield select(state => state.trade.tradeInfo);
      bankCard = tradeInfo.bankCardID;
      phoneNumber = tradeInfo.phoneNumber;

      const { data } = yield call(sendCreditSmsCode, {bankCard: bankCard, phoneNumber: phoneNumber});
      let payload = {};
      if(data && data['success']) {
        Toast.success('短信验证码已发送，请注意查收!');
        payload['tradeSmsSend'] = 0
        yield put({
          type: 'updateState',
          payload: payload
        })
      } else {
        Toast.fail(data.errorMsg || '');
        let smsData = yield select(state => state.trade['tradeSmsSend']);
        payload['tradeSmsSend'] = smsData + 3
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
    

    *getSellteType({ payload }, { call, put, select}) {
      const { data } = yield call(sellteTypeService, payload);
      if(data && data['success']) {
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
    *applyDualMsg({ payload }, { call, put, select}) {
      const tradeInfo = yield select(state => state.trade.tradeInfo);
      const { data } = yield call(dualMsgService, tradeInfo);
      if(data && data['success']) {
        Toast.success('交易短信获取成功！');
        // yield put(routerRedux.push({
        //   pathname: '/userinfo',
        // }));
        // yield put({
        //   type: 'updateState',
        //   payload: {
        //     channelResultNo: data.result.channelResultNo,
        //   }
        // });
        const { data: qData } = yield call(quickDualService, {smsCode: tradeInfo.smsCode, channelResultNo:  data.result.channelResultNo});
        if(qData && qData.success) {
          Toast.success('交易成功！');
          yield put(routerRedux.push({
            pathname: '/myself'
          }))
        } else {
          Toast.success(data.errorMsg || '');          
        }
      } else {
        Toast.success(data.errorMsg || '');
      }
    },
    // quick pay  快捷支付(提交交易)
    *quickDual({ payload }, { call, put, select}) {
      const { data } = yield call(quickDualService, payload);
      if(data && data['success']) {
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
    updateTradeInfo(state, { payload }) {
      return { ...state, ...{tradeInfo: {...state.tradeInfo, ...payload} } };
    },
    updateCreditInfo(state, { payload }) {
      return { ...state, ...{creditInfo: {...state.creditInfo, ...payload} } };
    },

  },

};
