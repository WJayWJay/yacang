import { login, register, code } from '../services/user';
import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';

export default {
  namespace: 'app',
  state: {
    locationPathname: '',
    locationQuery: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(( location ) => {
        // if (pathname === '/users') {
        //   dispatch({ type: 'fetch', payload: query });
        // }
        
        if(location) {
          dispatch({
            type: 'updateState',
            payload: {
              locationPathname: location.pathname,
              locationQuery: queryString.parse(location.search),
            },
          })
        }
      });
    },
  },

  effects: {
    *fetch({ payload: { page } }, { call, put, select}) {  // eslint-disable-line
      // yield put({ type: 'save' });
      const { data } = yield call(register, {pageNo: page});
      console.log('fetch', data)
      if( data && data['success'] && data['result'] ) {
        yield put({type: 'save', payload: { data: data.result.results, total: data.result.totalSize}})
      }
    },
  },

  reducers: {
    save(state, { payload: {data: info} }) {
      return { ...state, info, isLogin: 1 };
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },

};
