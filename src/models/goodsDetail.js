import { detail } from '../services/product';
import pathToRegexp from 'path-to-regexp';

export default {

  namespace: 'goodsDetail',

  state: {
    detail: {},
    id: ''
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        console.log(pathname, query)
        const re = pathToRegexp('/goodsDetail/:id');
        const match = re.exec(pathname);
        if ( Array.isArray(match) ) {
          let productNo = match[1]; 
          dispatch({ type: 'fetch', payload: {productNo} });
        }
      });
    },
  },

  effects: {
    *fetch({ payload: { productNo } }, { call, put, select}) {  // eslint-disable-line
      // yield put({ type: 'save' });
      console.log(productNo)
      const { data } = yield call(detail, {productNo});
      console.log('fetch', data)
      if( data && data['success'] && data['result'] ) {
        yield put({type: 'save', payload: { data: data.result, id: productNo}})
      }
    },
  },

  reducers: {
    save(state, { payload: {data: detail, id: id} }) {
      return { ...state, detail, id };
    },
  },

};
