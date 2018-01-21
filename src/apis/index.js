
// const API = process.env.NODE_ENV === 'development'? 'http://121.8.160.34:8899/huicang' : '';
const API = process.env.NODE_ENV === 'development'? '/huicang' : '';


export function loginApi() {
  return API + '/login/main';
}
export function registerApi() {
  return API + '/msg/register';
}
export function codeApi() {
  return API + '/msg/applyMsg';
}

export function getProduct() {
  return API + '/product/getProductInfo';
}
export function productDetail() {
  return API + '/product/getProductDetail';
}