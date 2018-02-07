import { productList, productCategory } from '../services/product';
// import pathToRegexp from 'path-to-regexp';
import Cache from '../utils/cache';

let categoryKey = 'category@productList';

export default {

  namespace: 'product',

  state: {
    list: [],
    total: 0,
    page: 1,
    category: [],
    hasMore: true,
    currentCat: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({ pathname, query }) => {
        console.log(pathname, query)
        if(pathname === '/productList') {

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
    *fetch({ payload: payload }, { call, put, select}) {  // eslint-disable-line
      // yield put({ type: 'save' });
      console.log(payload)
      const { data } = yield call(productList, payload);
      let hasMore = true;
      if(payload && payload.categoryNo) {
        yield put({type: 'updateState', currentCat: payload.categoryNo});
      }
      if( data && data['success'] && data['result'] ) {
        if(!Array.isArray(data.result.results)) {
          hasMore = false;
        }
        if(Array.isArray(data.result.results) && data.result.results.length) {
          if(data.result.results.length < 10) {
            hasMore = false;
          }
        }
        yield put({type: 'save', payload: { data: data.result.results||[], total: data.result.totalSize}});
        
      }
    },
    *fetchCategory({ payload: {}}, { call, put, select}) {
      let categoryData = Cache.get(categoryKey);

      if(categoryData) {
        yield put({
          type: 'updateState',
          payload: { category: categoryData}
        })
      }

      const { data } = yield call(productCategory, {});
      if( data && data['success'] && data['result'] ) {
        yield put({
          type: 'updateState',
          payload: { category: data.result }
        })
        Cache.set(categoryKey, data.result);
      }
    }
  },

  reducers: {
    save(state, { payload: {data: list, total, page} }) {
      return { ...state, list, total, page };
    },
    updateState(state, { payload }) {
      return {...state, ...payload}
    },
  },

};
