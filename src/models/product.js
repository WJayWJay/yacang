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
      // console.log(payload)
      let page = yield select(s => s.product.page);
      let mores = yield select(s => s.product.hasMore);
      let list = yield select(s => s.product.list);
      let currentCat = yield select(s => s.product.currentCat);

      const isSameCat = currentCat === payload.categoryNo;
      if(!payload.categoryNo || (isSameCat && mores === false)) return;
      page = isSameCat ? page || 1 : 1;
      
      const { data } = yield call(productList, {page: page, categoryNo: payload.categoryNo});
      let hasMore = true;

      if(payload && payload.categoryNo) {
        yield put({type: 'updateState', payload: {currentCat: payload.categoryNo}});
      }
      if( data && data['success'] && data['result'] ) {
        if(!Array.isArray(data.result.results)) {
          hasMore = false;
          if(isSameCat) {
            return;
          }
        }
        if(Array.isArray(data.result.results)) {
          if(data.result.results.length < 10) {
            hasMore = false;
          }
        }
        // yield put({type: 'updateListState', payload: { [payload.categoryNo]: data.result.results}});
        // yield put({type: 'updateHasMoreState', payload: { [payload.categoryNo]: hasMore}});
        // yield put({type: 'updatePageState', payload: { [payload.categoryNo]: (page | 0) + 1}});
        list = isSameCat ? list.concat(data.result.results) : data.result.results;
        yield put({type: 'updateHasMoreState', payload: { hasMore }});
        yield put({type: 'save', payload: { list: list || [], total: data.result.totalSize, page: page + 1}});
        
      }
    },
    *fetchCategory({ payload: {}}, { call, put, select}) {
      const categorys = Cache.get(categoryKey);
      if(categorys) {
        yield put({
          type: 'updateState',
          payload: { category: categorys }
        });
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
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    updateListState(state, {payload}) {
      return {...state, ...{list: {...state.list, ...payload}}}
    },
    updateHasMoreState(state, {payload}) {
      return {...state, ...payload}
    },
    updatePageState(state, {payload}) {
      return {...state, ...{page: {...state.page, ...payload}}}
    },
    updateState(state, { payload }) {
      return {...state, ...payload}
    },
  },

};
