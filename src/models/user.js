import { login, register, code, userinfo, wxUserInfo, getMemberData, resetPass} from '../services/user';
import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import Cache from '../utils/cache';

const userKey = 'user@info';
const loginKey = 'isLogin';
const tokenKey = 'user@tokeyId';

export default {
  namespace: 'user',
  history: null,
  state: {
    info: {},
    isLogin: 0,
    codeSend: 0,
    tokenId: '',
    members: [],
    inviteAward: '',
    resetPasswords: {'msgType': '003'},
    resetSmsSend: -1,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      let isLogin = Cache.get(loginKey);
      let info = Cache.get(userKey);
      let tokenId = Cache.get(tokenKey);
      if(isLogin && tokenId) {
        dispatch({
          type: 'updateLogin',
          payload: {isLogin, tokenId}
        });
        dispatch({
          type: 'getUserInfo',
          payload: {}
        })
      }
      if(info) {
        dispatch({
          type: 'updateInfo',
          payload: {info}
        })
      }

    },
  },

  effects: {
    *resetPassword({ payload: {} }, { call, put, select}) {
      const resetPasswords = yield select(state => state.card.resetPasswords);
      const { data } = yield call(resetPass, resetPasswords);
      if(data && data['success']) {
        Toast.success('支付密码重置成功！');
        yield put(routerRedux.push({
          pathname: '/login',
        }));
        yield put({
          type: 'resetPasswords',
          payload: {
            messages: '',
            configPassword: '',
            newPassword: ''
          }
        });
      } else {
        Toast.success(data.errorMsg || '');
      }
    },
    *fetchResetCode({ payload: { type } }, { call, put, select}) {  // eslint-disable-line

      const resetPasswords = yield select(state => state.user.resetPasswords);

      const { data } = yield call(code, resetPasswords);
      if( data && data['success'] ) {
        Toast.success('验证码已发送, 请注意查收!');
        yield put({
          type: 'updateState',
          payload: {resetSmsSend: 0}
        })
      } else {
        Toast.fail(data && data.errorMsg || '发生错误');
        let smsData = yield select(state => state.user.resetSmsSend);
        yield put({
          type: 'updateState',
          payload: {resetSmsSend: smsData + 3}
        })
      }
    },
    *getUserInfoByWx({ payload: { code } }, { call, put, select}) {  // eslint-disable-line
      const { data } = yield call(wxUserInfo, {wechatCode: code});
      if(data && data['success']) {
        Toast.success('授权登录成功！');
        if(data.result) {
          Cache.set(userKey, data.result, true);
          Cache.set(tokenKey, data.result.tokenId || '');
          Cache.set(loginKey, 1);
          if(data.result.companyPhone) {
            yield put(routerRedux.push({
              pathname: '/myself',
            }))
          } else {
            yield put(routerRedux.push({
              pathname: '/register',
            }))
          }
        } else {
          yield put(routerRedux.push({
            pathname: '/register',
          }))
        }

      } else {
        yield put({
          type: 'logout',
          payload: {}
        })
        // yield put( routerRedux.push({
        //   pathname: '/login',
        //   search: '?uri='+ window.location.href
        // }) )
      }
    },
    *getUserInfo({ payload: { } }, { call, put, select}) {  // eslint-disable-line
      const { data } = yield call(userinfo, {});
      // console.log(data, 'userinfo...')
      if(data && data['success']) {
        Cache.set(userKey, data.result, true);
        Cache.set(tokenKey, data.result.tokenId);
        Cache.set(loginKey, 1);
      } else {
        yield put({
          type: 'logout',
          payload: {}
        })
        yield put( routerRedux.push({
          pathname: '/login',
          search: '?uri='+ window.location.href
        }) )
      }
    },
    *fetch({ payload: { page } }, { call, put, select}) {  // eslint-disable-line
      // yield put({ type: 'save' });
      const { data } = yield call(register, {pageNo: page});
      if( data && data['success'] && data['result'] ) {
        yield put({type: 'save', payload: { data: data.result.results, total: data.result.totalSize}})
      }
    },
    *loginPost({ payload: { code, phone } }, { call, put, select}) {  // eslint-disable-line
      // yield put({ type: 'save' });
      let locationQuery = yield select(state => state.app.locationQuery);

      const { data } = yield call(login, {messages: code, phoneNumber: phone});
      if( data && data['success'] && data['result'] ) {
        Toast.success('登录成功!', 1.5);
        yield put({type: 'save', payload: { data: data.result}});
        yield put({type: 'updateLogin', payload: {isLogin: 1, tokenId: data.result.tokenId }});
        Cache.set(userKey, data.result, true);
        Cache.set(tokenKey, data.result.tokenId);
        Cache.set(loginKey, 1);

        if(locationQuery && locationQuery.uri) {
          window.location.href = locationQuery.uri;
        } else {
          yield put(routerRedux.push({
            pathname: '/myself'
          }));
        }
      } else {
        Toast.fail(data && data.errorMsg || '登录失败', 2);
      }
    },
    *fetchCode({ payload: { phone } }, { call, put, select}) {  // eslint-disable-line

      const isSend = yield select(state => state.user.codeSend);
      if(isSend === 1) {
        return ;
      }
      const { data } = yield call(code, {companyPhone: phone, 'msgType': '001'});

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
    *getMemberInfo({ payload: { } }, { call, put, select}) {  // eslint-disable-line
      const { data } = yield call(getMemberData, {});
      if(data && data['success']) {
        let members = data.result && data.result.subMemberQueryInResponseList || [];
        let inviteAward = data.result && data.result.inviteAward || '0.00';
        yield put({
          type: 'updateState',
          payload: { members }
        });
        yield put({
          type: 'updateState',
          payload: { inviteAward }
        });
      } else {
        // Toast.fail(data && data.errorMsg || '发生错误');
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    resetPasswords(state, { payload }) {
      return { ...state, ...{resetPasswords: {...state.resetPasswords, ...payload} } };
    },
    save(state, { payload: {data: info} }) {
      return { ...state, info, isLogin: 1 };
    },
    updateLogin(state, { payload: {isLogin, tokenId} }) {
      return { ...state, isLogin: 1, tokenId };
    },
    updateInfo(state, { payload: {info} }) {
      return { ...state, info };
    },
    changeCodeSend(state, {payload: {codeSend}}) {
      return { ...state, codeSend };
    },
    logout(state, {payload: {}}) {
      Cache.remove([loginKey, userKey, tokenKey]);
      return { ...state, info:{}, isLogin: 0, tokenId: '' };
    }
  },

};
