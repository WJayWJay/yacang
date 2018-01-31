import post from '../utils/post';

import { cardList, cardCreditBind, bindDebitCard } from '../apis'


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
