import post from '../utils/post';

import { registerApi, loginApi, logoutApi, codeApi } from '../apis'

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
  
  return post(logoutApi(), data);
}

export function register(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  return post(registerApi(), data);
}

