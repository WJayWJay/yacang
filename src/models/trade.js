import { sendCreditSmsCode,
   dualMsgService, sellteTypeService,
   quickDualService, orderListService, orderDetailService,
   queryPreArrivalAmountService, cashierDeskService
} from '../services/trade';

// import pathToRegexp from 'path-to-regexp';
import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';

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
    tradeList: {
      total: 0,
      hasMore: true,
      orderList: [],
      getListError: null,
      orderDetail: {},
      isLoading: false,
      tradeListPage: 1
    },

    arrivalAmount: '0',

    pageCount: 10,
    paySelectType: 0,
    randomTime: Date.now()
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        // console.log(location)
        if(['/tradeList'].indexOf(location.pathname) > -1) {
          dispatch({
            type: 'updateState',
            payload: {randomTime: Date.now()}
          })
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

      // const { data } = yield call(sendCreditSmsCode, {bankCard: bankCard, phoneNumber: phoneNumber});
      const { data } = yield call(dualMsgService, tradeInfo);
      let payload = {};
      if(data && data['success']) {
        Toast.success('短信验证码已发送，请注意查收!');
        yield put({
          type: 'updateState',
          payload: {
            channelResultNo: data.result.channelResultNo,
          }
        });
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
        Toast.fail(data.errorMsg || '');
      }
    },
    *queryPreArrivalAmount({ payload }, { call, put, select}) {
      yield put({
        type: 'updateState',
        payload: {
          arrivalAmount: 0,
        }
      });
      const tradeInfo = yield select(state => state.trade.tradeInfo);
      let payType = '0';
      const { data } = yield call(queryPreArrivalAmountService, {
        payMoney: tradeInfo.payMoney,
        bankCardID: tradeInfo.bankCardID,
        settleType: tradeInfo.settleType,
        payType: payType,
      });
      if(data && data['success']) {
        yield put({
          type: 'updateState',
          payload: {
            arrivalAmount: (data.result.arrivalAmount | 0) / 100,
          }
        });
      } else {
        Toast.fail(data.errorMsg || '');
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
        // const { data: qData } = yield call(quickDualService, {smsCode: tradeInfo.smsCode, channelResultNo:  data.result.channelResultNo});
        // if(qData && qData.success) {
        //   Toast.success('交易成功！');
        //   yield put(routerRedux.push({
        //     pathname: '/myself'
        //   }))
        // } else {
        //   Toast.success(data.errorMsg || '');          
        // }
      } else {
        Toast.success(data.errorMsg || '');
      }
    },
    // quick pay  快捷支付(提交交易)
    *quickDual({ payload }, { call, put, select}) {
      const tradeInfo = yield select(state => state.trade.tradeInfo);
      const channelResultNo = yield select(state => state.trade.channelResultNo);
      // const { data } = yield call(quickDualService, payload);
      const { data } = yield call(quickDualService, {smsCode: tradeInfo.smsCode, channelResultNo: channelResultNo});
      if(data && data['success']) {
        Toast.success('交易成功！');
        yield put(routerRedux.push({
          pathname: '/tradeList',
        }));
      } else {
        Toast.fail(data.errorMsg || '');
      }
    },
    // 收银台支付(提交交易)
    *cashierDesk({ payload }, { call, put, select}) {
      const tradeInfo = yield select(state => state.trade.tradeInfo);
      // const { data } = yield call(quickDualService, payload);
      const { data } = yield call(cashierDeskService, {payMoney: tradeInfo.payMoney, settleType: tradeInfo.settleType});
      if(data && data['success']) {
        Toast.success('交易成功！');
        yield put(routerRedux.push({
          pathname: '/tradeList',
        }));
      } else {
        Toast.fail(data.errorMsg || '');
      }
    },
    
    *orderList({ payload }, { call, put, select}) {
      let pageCount = yield select(s => s.trade.pageCount),
      hasMore = yield select(s => s.trade.tradeList.hasMore),
      isLoading = yield select(s => s.trade.tradeList.isLoading);
      if(Object.prototype.toString.call(payload) !== "[object Object]") {
        payload = {};
      }
      const tListArr = ['DRAWCASH', 'REPAYMENT'];
      let type = payload.type;

      if(!hasMore || isLoading || tListArr.indexOf( type ) === -1) return;
      
      if(!payload.hasOwnProperty('pageCount')) {
        payload.pageCount = pageCount;
      }
      payload.bizType = type;
      yield put({
        type: 'updateTradeList',
        payload: {isLoading: true}
      });
      const { data } = yield call(orderListService, payload);
      if(data && data['success']) {
        let prevList = yield select(s => s.trade.tradeList.orderList);
        let orderList = data.result && data.result.results || [];

        if(orderList.length < payload.pageCount) {
          hasMore = false;
        }
        
        orderList = prevList.concat(orderList);
        let total = data.result && data.result.totalSize | 0;
        let tradeListPage = yield select(s => s.trade.tradeList.tradeListPage);
        yield put({
          type: 'updateTradeList',
          payload: {orderList: orderList, total: total, hasMore: hasMore, isLoading: false, tradeListPage: tradeListPage +1}
        });
      } else {
        // Toast.success(data.errorMsg || '');
        yield put({
          type: 'updateTradeList',
          payload: {
            getListError: {err: payload, errmsg: data.errorMsg, page: payload.currentPage, isLoading: false}
          }
        });
      }
    },
    *orderDetail({ payload }, { call, put, select}) {
      const { data } = yield call(orderDetailService, payload);
      if(data && data['success']) {
        let result = data.result;
        result = Array.isArray(result)? result[0]? result[0]: {} : {};
        yield put({
          type: 'updateTradeList',
          payload: {orderDetail: result}
        });
      } else {
        Toast.success(data.errorMsg || '');
      }
    },
    
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    updateTradeList(state, { payload }) {
      return { ...state, ...{tradeList: {...state.tradeList, ...payload} } };
    },
    updateTradeInfo(state, { payload }) {
      return { ...state, ...{tradeInfo: {...state.tradeInfo, ...payload} } };
    },
    updateCreditInfo(state, { payload }) {
      return { ...state, ...{creditInfo: {...state.creditInfo, ...payload} } };
    },

  },

};
