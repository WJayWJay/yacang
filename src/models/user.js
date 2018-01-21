import { login, register, code } from '../services/user';
import { Toast } from 'antd-mobile';

export default {
  namespace: 'user',
  state: {
    info: {},
    isLogin: false,
    codeSend: 0
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // dispatch({ type: 'fetch', payload: {productNo} });
    },
  },

  effects: {
    *fetch({ payload: { page } }, { call, put, select}) {  // eslint-disable-line
      // yield put({ type: 'save' });
      console.log(page)
      const { data } = yield call(register, {pageNo: page});
      console.log('fetch', data)
      if( data && data['success'] && data['result'] ) {
        yield put({type: 'save', payload: { data: data.result.results, total: data.result.totalSize}})
      }
    },
    *loginPost({ payload: { code, phone } }, { call, put, select}) {  // eslint-disable-line
      // yield put({ type: 'save' });
      const { data } = yield call(login, {messages: code, phoneNumber: phone});
      console.log('login', data)
      if( data && data['success'] && data['result'] ) {
        Toast.success('登录成功!');
        yield put({type: 'save', payload: { data: data.result}})
      } else {
        Toast.fail(data && data.errorMsg || '登录失败');
      }
    },
    *fetchCode({ payload: { phone } }, { call, put, select}) {  // eslint-disable-line
      
      const isSend = yield select(state => state.user.codeSend);
      if(isSend === 1) {
        return ;
      }
      const { data } = yield call(code, {companyPhone: phone});
      console.log('fetchCode', data)
      if( data && data['success'] ) {
        Toast.success('验证码已发送, 请注意查收!');
        yield put({type: 'changeCodeSend', payload: { codeSend: 1}});
      } else {
        Toast.fail(data && data.errorMsg || '发生错误');
        if(isSend !== 0) {
          yield put({type: 'changeCodeSend', payload: { codeSend: 0}});
        }
      }
    },
  },

  reducers: {
    save(state, { payload: {data: info} }) {
      return { ...state, info, isLogin: true };
    },
    changeCodeSend(state, {payload: {codeSend}}) {
      console.log(codeSend, 'change')
      return { ...state, codeSend };
    }
  },

};
