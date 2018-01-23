import { productList } from '../services/product';
// import pathToRegexp from 'path-to-regexp';


export default {

  namespace: 'product',

  state: {
    list: [],
    total: 0,
    page: 1,
    hasMore: true
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
      let hasMore = true;
      console.log('fetch', data)
      if( data && data['success'] && data['result'] ) {
        if(!Array.isArray(data.result.results)) {
          hasMore = false;
        }
        if(Array.isArray(data.result.results) && data.result.results.length) {
          page = +1;
          if(data.result.results.length < 10) {
            hasMore = false;
          }
        }
        yield put({type: 'save', payload: { data: data.result.results, total: data.result.totalSize, page, hasMore}})
      }
    },
  },

  reducers: {
    save(state, { payload: {data: list, total, page, hasMore} }) {
      return { ...state, list, total, page, hasMore };
    },
  },

};
