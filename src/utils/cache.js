
function setCookie(name,value)
{
  var hour = 2;
  var exp = new Date();
  exp.setTime(exp.getTime() + hour*60*60);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getCookie(name)
{
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg)) {
    return unescape(arr[2]);
  } 
  return null;
}

const Cache = (function(){
  const c = function(){
    this.cache = {};
  };
  
  c.prototype.set = function(key, item, isCookie = false) {
    this.cache[key] = item;
    item = JSON.stringify(item);
    try {
      localStorage.setItem(key, item);
    } catch(e) {
      
    }
    try {
      sessionStorage.setItem(key, item);
    } catch(e) {
      console.log('err')
    }
    if(isCookie) {
      setCookie(key, item);
    }
  }
  c.prototype.get = function(key) {
    var value = '';
    value = this.cache[key];
    if(value) {
      return value;
    }
    value = localStorage.getItem(key);
    if(!value) {
      value = sessionStorage.getItem(key);
      if(!value) {
        value = getCookie(key);
      }
    }

    if(!value) {
      return value;
    }
    try {
      value = JSON.parse(value);
    } catch(e) {
      console.log('error')
    }
    return value;
  }
  c.prototype.delete = function(key) {
    try {
      this.cache[key] = null;
      setCookie(key, '');
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    } catch(e) {
      console.log(e, 'error when remove cache');
    }
  }
  c.prototype.remove = function(keys) {
    if( Array.isArray(keys) ) {
      keys.forEach((key) => {key && this.delete(key)});
    } else if(typeof keys === 'string') {
      this.delete(keys);
    }
  }


  return new c();
})();


export default Cache; 