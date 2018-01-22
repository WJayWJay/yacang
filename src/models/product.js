import { productList } from '../services/product';
import pathToRegexp from 'path-to-regexp';


export default {

  namespace: 'product',

  state: {
    list: [],
    total: null
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        console.log(pathname, query)
        if(pathname === '/productList') {
          dispatch({ type: 'fetch', payload: {page: 1} });
        }
        // const re = pathToRegexp('/productList');
        // const match = re.exec(pathname);
        // if ( Array.isArray(match) ) {
        //   let productNo = match[1]; 
        //   dispatch({ type: 'fetch', payload: {productNo} });
        // }
      });
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
