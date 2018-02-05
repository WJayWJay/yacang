

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
