import { productList } from '../services/product'

export default {

  namespace: 'product',

  state: {
    list: [],
    total: null
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload: { page } }, { call, put, select}) {  // eslint-disable-line
      // yield put({ type: 'save' });
      console.log(page)
      const { data } = yield call(productList, {pageNo: page});
      console.log('fetch', data)
      if( data && data['success'] && data['result'] ) {
        yield put({type: 'save', payload: { data: data.result.results, total: data.result.totalSize}})
      }
    },
  },

  reducers: {
    save(state, { payload: {data: list, total} }) {
      return { ...state, list, total };
    },
  },

};
