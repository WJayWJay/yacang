import { productList, productCategory } from '../services/product';
// import pathToRegexp from 'path-to-regexp';
import Cache from '../utils/cache';

let categoryKey = 'category@productList';

export default {

  namespace: 'product',

  state: {
    list: {},
    total: 0,
    page: {},
    category: [],
    hasMore: {},
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
      // console.log(payload)
      let pages = yield select(s => s.product.page);
      let mores = yield select(s => s.product.hasMore);
      if(!payload.categoryNo || mores[payload.categoryNo] === false) return;
      pages = pages || {};
      let page = pages[payload.categoryNo] || 1;
      const { data } = yield call(productList, {payload: {page: page, categoryNo:payload.categoryNo}});
      let hasMore = true;
      if(payload && payload.categoryNo) {
        yield put({type: 'updateState', payload: {currentCat: payload.categoryNo}});
      }
      if( data && data['success'] && data['result'] ) {
        if(!Array.isArray(data.result.results)) {
          hasMore = false;
          return;
        }
        if(Array.isArray(data.result.results) && data.result.results.length) {
          if(data.result.results.length < 10) {
            hasMore = false;
          }
        }
        yield put({type: 'updateListState', payload: { [payload.categoryNo]: data.result.results}});
        yield put({type: 'updateHasMoreState', payload: { [payload.categoryNo]: hasMore}});
        yield put({type: 'updatePageState', payload: { [payload.categoryNo]: (page | 0) + 1}});
        // yield put({type: 'save', payload: { data: data.result.results||[], total: data.result.totalSize}});
        
      }
    },
    *fetchCategory({ payload: {}}, { call, put, select}) {
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
      return { ...state, total, page };
    },
    updateListState(state, {payload}) {
      return {...state, ...{list: {...state.list, ...payload}}}
    },
    updateHasMoreState(state, {payload}) {
      return {...state, ...{hasMore: {...state.hasMore, ...payload}}}
    },
    updatePageState(state, {payload}) {
      return {...state, ...{page: {...state.page, ...payload}}}
    },
    updateState(state, { payload }) {
      return {...state, ...payload}
    },
  },

};
