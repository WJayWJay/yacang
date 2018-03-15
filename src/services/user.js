import post from '../utils/post';

import { registerApi, loginApi, weixinLogin, codeApi, getUserInfoApi, subMemberQueryApi, resetPassApi, resetPassSmsApi, wxInitJssdkApi } from '../apis'

export function login(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});

  return post(loginApi(), data);
}

export function code(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});

  return post(codeApi(), data);
}

export function logout(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});

  // return post(logoutApi(), data);
}

export function register(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  return post(registerApi(), data);
}
export function userinfo(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  return post(getUserInfoApi(), data);
}
export function wxUserInfo(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  return post(weixinLogin(), data);
}
export function getMemberData(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  return post(subMemberQueryApi(), data);
}

export function resetPass(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  return post(resetPassApi(), data);
}
export function resetPassSmsService(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  return post(resetPassSmsApi(), data);
}

export function wxInitJssdk(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  return post(wxInitJssdkApi(), data);
}
