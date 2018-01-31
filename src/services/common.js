import post from '../utils/post';

import { homeDetail } from '../apis'


export function homeInfo(obj) {
  let data ={
    initiationID: Date.now().toString(16)
  };
  data = Object.assign({}, data, obj || {});
  
  return post(homeDetail(), data);
}
