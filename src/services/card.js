import post from '../utils/post';
import postData from '../utils/postData';

import { cardList, cardCreditBind, bindDebitCard, sendCreditSms, imgUpload, revisePassApi } from '../apis'


export function listCard(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});

  return post(cardList(), data);
}
export function bindCreditCard(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});

  return post(cardCreditBind(), data);
}
export function bindCardDebit(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});

  return post(bindDebitCard(), data);
}

export function sendCreditSmsCode(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});

  return post(sendCreditSms(), data);
}
export function imageUpload(formData) {
  if(!formData) {
    return;
  }
  formData.append('initiationID', Date.now().toString(16));
  return postData(imgUpload(), formData);
}

export function revisePass(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  return postData(revisePassApi(), data);
}
