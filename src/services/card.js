import post from '../utils/post';
import postData from '../utils/postData';

import { cardList, cardCreditBind, bindDebitCard,
  sendCreditSms, imgUpload, revisePassApi,
  dualMsgApi, sellteTypeApi, quickDualApi,
  cashierDeskApi,applyDebitSms
} from '../apis'


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
export function applyDebitSmsService(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});

  return post(applyDebitSms(), data);
}
export function imageUpload(formData) {
  if(!formData) {
    return;
  }
  formData.append('initiationID', Date.now().toString(16));
  return postData(imgUpload(), formData);
}

export function revisePass(obj) {
  let data ={};
  data = Object.assign({}, data, obj || {});
  return post(revisePassApi(), data);
}
export function dualMsgService(obj) {
  let data ={};
  data = Object.assign({}, data, obj || {});
  return post(dualMsgApi(), data);
}
export function sellteTypeService(obj) {
  let data ={};
  data = Object.assign({}, data, obj || {});
  return post(sellteTypeApi(), data);
}

export function quickDualService(obj) {
  let data ={};
  data = Object.assign({}, data, obj || {});
  return post(quickDualApi(), data);
}
export function cashierDeskService(obj) {
  let data ={};
  data = Object.assign({}, data, obj || {});
  return post(cashierDeskApi(), data);
}