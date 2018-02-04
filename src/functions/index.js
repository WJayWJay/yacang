

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