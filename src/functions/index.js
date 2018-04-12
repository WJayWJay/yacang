
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
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: config.appId || Constant.appid , // 必填，公众号的唯一标识
    timestamp: config.timestamp, // 必填，生成签名的时间戳
    nonceStr: config.nonceStr, // 必填，生成签名的随机串
    signature: config.signature,// 必填，签名
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
  });

  window.wx.ready(function(){
    let link = location.protocol + '//' + location.host + location.pathname; //eslint-disable-line
    let title = '汇藏',
          desc = '汇聚国内外精品古藏',
          imgUrl =  link + 'logo.png'; 
    shareToFriendsCircle(title, imgUrl, link);
    
    shareToFriends(title, desc, imgUrl, link);
    
    shareToQQ(title, desc, imgUrl, link);
    
  })
}


// 将file转成dataUrl
export function transformFileToDataUrl (file) {
  return new Promise((resolve, reject) => {
    const imgCompassMaxSize = 510 * 1024; // 超过 200k 就压缩
    let imgFile = {};
    // 存储文件相关信息
    imgFile.type = file.type || 'image/jpeg'; // 部分安卓出现获取不到type的情况
    imgFile.size = file.size;
    imgFile.name = file.name;
    imgFile.lastModifiedDate = file.lastModifiedDate;

    // 封装好的函数
    const reader = new FileReader();

    // file转dataUrl是个异步函数，要将代码写在回调里
    reader.onload = function (e) {
      const result = e.target.result;

      if (result.length < imgCompassMaxSize) {
        // compress(result, processData, false);    // 图片不压缩
        compress(result, imgFile, false).then((compressDataUrl) => {
          resolve(compressDataUrl);
        })    // 图片不压缩
      } else {
        // compress(result, processData);            // 图片压缩
        compress(result, imgFile).then(compressDataUrl => {
          resolve(compressDataUrl);
        });            // 图片压缩
      }
    };

    reader.readAsDataURL(file);
  });
}

// 使用canvas绘制图片并压缩
export function compress (dataURL, imgFile, shouldCompress = true) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();

    img.src = dataURL;

    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let compressedDataUrl;
      console.log(shouldCompress,'shouldCompress');
      if (shouldCompress) {
        compressedDataUrl = canvas.toDataURL(imgFile.type, 0.2);
      } else {
        compressedDataUrl = canvas.toDataURL(imgFile.type, 1);
      }

      // callback(compressedDataUrl);
      resolve(compressedDataUrl);
    }
  });
}


export function processData (dataUrl, imgFile) {
  return new Promise((resolve, reject) => {
    // 这里使用二进制方式处理dataUrl
    const binaryString = window.atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const intArray = new Uint8Array(arrayBuffer);
    // const imgFile = this.imgFile;

    for (let i = 0, j = binaryString.length; i < j; i++) {
      intArray[i] = binaryString.charCodeAt(i);
    }

    const data = [intArray];

    let blob;

    try {
      blob = new Blob(data, { type: imgFile.type });
    } catch (error) {
      window.BlobBuilder = window.BlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MozBlobBuilder ||
        window.MSBlobBuilder;
      if (error.name === 'TypeError' && window.BlobBuilder) {
        const builder = new window.BlobBuilder();
        builder.append(arrayBuffer);
        blob = builder.getBlob(imgFile.type);
      } else {
        // Toast.error("版本过低，不支持上传图片", 2000, undefined, false);
        // throw new Error('版本过低，不支持上传图片');
        reject(new Error('版本过低，不支持上传图片'));
      }
    }

    // blob 转file
    const fileOfBlob = new File([blob], imgFile.name);
    // const formData = new FormData();

    // type
    // formData.append('type', imgFile.type);
    // size
    // formData.append('size', fileOfBlob.size);
    // name
    // formData.append('name', imgFile.name);
    // lastModifiedDate
    // formData.append('lastModifiedDate', imgFile.lastModifiedDate);
    // append 文件
    // formData.append('file', fileOfBlob);
    
    // uploadImg(formData);
    // return fileOfBlob;

    resolve(fileOfBlob);
  });
}