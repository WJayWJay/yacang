
import Constant from '../constant';

export function cacheUserInfo() {

}

export function getFileValueProps(value) {
    if (value && value.target) {
      return {
        value: value.target.value,
      };
    }
    return {
      value,
    };
}

export function getValueFromFileEvent({ target }) {
    return {
        target,
    };
}
export function isWeixin() {
  let ua = window.navigator && window.navigator.userAgent;
  ua = ua && ua.toLowerCase();
  return /micromessenger/i.test(ua);
}
export function isPhone(number) {
  return /^1[3456789]\d{9}$/.test(number);
}

export function deepCopy(arr1) {
  var arr = [];
  if(Array.isArray(arr1)) {
    for(var i= 0; i < arr1.length; i++) {
      if(typeof arr1[i] === 'object') {
        arr[i] = deepCopy(arr1[i]);
      } else {
        arr[i] = arr1[i];
      }
    }
    return arr;
  } else if(!arr1) {
    return arr1;
  } else if(Object.prototype.toString.call(arr1) === '[object Object]') {
    arr = {};
    for(var x in arr1) {
      if(arr1.hasOwnProperty(x)) {
        if(typeof arr1[x] === 'object') {
          arr[x] = deepCopy(arr1[x]);
        } else {
          arr[x] = arr1[x];
        }
      }
    }
    return arr;
  } else {
    arr = arr1;
  }
  return arr;
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function shareToFriendsCircle(title, imgUrl, link, fn) {
  fn = typeof link === 'function' ? link: fn;
  // eslint-disable-next-line
  window.wx.onMenuShareTimeline({
    title: title || '汇藏', // 分享标题
    link: link || window.location.href , // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: imgUrl, // 分享图标
    success: function (e) {
    // 用户确认分享后执行的回调函数
      typeof fn === 'function' && fn(e);
    },
  });
}

export function shareToFriends(title, desc, imgUrl, link, fn) {
  fn = typeof link === 'function' ? link: fn;
  // eslint-disable-next-line
  window.wx.onMenuShareAppMessage({
    title: title || '汇藏', // 分享标题
    desc: desc || '', // 分享描述
    link: link || window.location.href , // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: imgUrl, // 分享图标
    type: 'link', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function (e) {
    // 用户确认分享后执行的回调函数
      typeof fn === 'function' && fn(e);
    },
  });
}

export function shareToQQ(title, desc, imgUrl, link, fn) {
  fn = typeof link === 'function' ? link: fn;
  // eslint-disable-next-line
  window.wx.onMenuShareAppMessage({
    title: title || '汇藏', // 分享标题
    desc: desc || '', // 分享描述
    link: link || window.location.href, // 分享链接
    imgUrl: imgUrl, // 分享图标
    success: function (e) {
    // 用户确认分享后执行的回调函数
      typeof fn === 'function' && fn(e);
    },
  });
}

export function initJsApi(config) {
  // eslint-disable-next-line
  window.wx.config({
    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: config.appId || Constant.appid , // 必填，公众号的唯一标识
    timestamp: config.timestamp, // 必填，生成签名的时间戳
    nonceStr: config.nonceStr, // 必填，生成签名的随机串
    signature: config.signature,// 必填，签名
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
  });
}