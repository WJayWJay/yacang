import post from '../utils/post';

import { getProduct, productDetail, getProductCategory } from '../apis'

export function productList(obj) {
  let data ={
    pageSize: 10,
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  
  return post(getProduct(), data);
}
export function productCategory(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, {});
  
  return post(getProductCategory(), data);
}
export function detail(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  
  return post(productDetail(), data);
}
