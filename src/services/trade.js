import post from '../utils/post';
import {
  sendCreditSms,
  dualMsgApi, sellteTypeApi, quickDualApi,
  cashierDeskApi, orderListApi, orderDetailApi
} from '../apis'

export function sendCreditSmsCode(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});

  return post(sendCreditSms(), data);
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
export function orderListService(obj) {
  let data ={};
  data = Object.assign({}, data, obj || {});
  return post(orderListApi(), data);
}
export function orderDetailService(obj) {
  let data ={};
  data = Object.assign({}, data, obj || {});
  return post(orderDetailApi(), data);
}