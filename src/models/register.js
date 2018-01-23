import { code, register } from '../services/user';
import { Toast } from 'antd-mobile';

export default {
  namespace: 'register',
  state: {
    info: {},
    registerStatus: -1,
    codeSend: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // dispatch({ type: 'fetch', payload: {productNo} });
    },
  },

  effects: {
    *userRegister({ payload: { code: messages, phone: phoneNumber, inviteCode: invitationCode } }, { call, put, select}) {
      const { data } = yield call(register, {messages, phoneNumber, invitationCode});
      if(data && data['success']) {
        Toast.success('注册成功!');
        yield put({type: 'saveRegisterStatus', payload: {status: 0}});
      } else {
        Toast.fail(data && data.errorMsg || '注册失败');
      }
    },
    *fetchCode({ payload: { phone } }, { call, put, select}) {  // eslint-disable-line
      
      const isSend = yield select(state => state.user.codeSend);
      if(isSend === 1) {
        return ;
      }
      const { data } = yield call(code, {companyPhone: phone});
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
    save(state, { payload: {data: list, total} }) {
      return { ...state, list, total };
    },
    changeCodeSend(state, {payload: {codeSend}}) {
      console.log(codeSend, 'change')
      return { ...state, codeSend };
    },
    saveRegisterStatus(state, {payload: {status: registerStatus}}) {
      return { ...state, registerStatus };
    }
  },

};
