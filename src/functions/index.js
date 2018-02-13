

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
  let ua = navigator && navigator.userAgent;
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
    for(var i in arr1) {
      if(arr1.hasOwnProperty(i)) {
        if(typeof arr1[i] === 'object') {
          arr[i] = deepCopy(arr1[i]);
        } else {
          arr[i] = arr1[i];
        }
      }
    }
    return arr;
  } else {
    arr = arr1;
  }
  return arr;
}