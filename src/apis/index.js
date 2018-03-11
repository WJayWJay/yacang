
import Constant from '../constant';

// const API = process.env.NODE_ENV === 'development'? 'http://121.8.160.34:8899/huicang' : '';
const API = process.env.NODE_ENV === 'development'? '/huicang' : '/huicang';


export function loginApi() {
  return API + '/login/main';
}
export function getUserInfoApi() {
  return API + '/login/presentCustomerQuery';
}
export function registerApi() {
  return API + '/msg/register';
}
export function codeApi() {
  return API + '/msg/applyMsg';
}
export function subMemberQueryApi() {
  return API + '/customer/subMemberQuery';
}

export function getProduct() {
  return API + '/product/getProductInfo';
}
export function getProductCategory() {
  return API + '/product/getProductCategory';
}
export function productDetail() {
  return API + '/product/getProductDetail';
}
export function homeDetail() {
  return API + '/msg/getCarouselMessage';
}


export function cardList() {
  return API + '/bankCard/getBankCardList';
}
export function cardCreditBind() {
  return API + '/bankCard/bindCreditCard';
}
export function sendCreditSms() {
  return API + '/bankCard/applyOpenSms';
}
export function bindDebitCard() {
  return API + '/bankCard/bindDebitCard';
}
export function imgUpload() {
  return API + '/image/upload/1';
}
export function revisePassApi() {
  return API + '/customer/customerPasswordUpdate';
}

export function resetPassApi() {
  return API + '/customer/customerResetPassword';
}

export function weixinLogin() {
  return API + '/login/applyOpenid';
}
export function dualMsgApi() {
  return API + '/quickpay/applyDualMsg';
}
export function quickDualApi() {
  return API + '/quickpay/quickDual';
}
export function cashierDeskApi() {
  return API + '/cashierDesk/pay';
}
export function sellteTypeApi() {
  return API + '/sellteType/sellteTypeQuery';
}
export function queryPreArrivalAmountApi() {
  return API + '/quickpay/queryPreArrivalAmount';
}
export function orderListApi() {
  return API + '/order/queryOrderList';
}
export function orderDetailApi() {
  return API + '/order/queryOrderDetail';
}

export function wxUserApi(REDIRECT_URI,) {
  // const APPID = 'wx2f5543b30ccc34de';
  const APPID = Constant.appid;
  const SCOPE = 'snsapi_base';
  let state = Date.now().toString(16);
  REDIRECT_URI = REDIRECT_URI || window.location.href;
  REDIRECT_URI = encodeURIComponent(REDIRECT_URI);
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${state}#wechat_redirect`;
}
