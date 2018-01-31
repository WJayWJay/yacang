import { homeInfo } from '../services/common';
// import pathToRegexp from 'path-to-regexp';
import Cache from '../utils/cache';

const homeSwiperKey = 'homeSwiperKey@cache';

export default {

  namespace: 'home',

  state: {
    swiperList: [],
    tagList: []
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
      const { data } = yield call(homeInfo, {type: type});
      
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
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
