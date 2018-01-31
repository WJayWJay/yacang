
import queryString from 'query-string';

import request from './request';
import { productList } from '../services/product';
import Cache from './cache';


const tokenKey = 'user@tokeyId';
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [data] The data we want to pass to "fetch"
 * @param  {object} [header] The header we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
const post = function post(url, data = {}, header = {}) {
  let options = {};
  let tokenId = Cache.get(tokenKey);
  let headers = {
    // "Content-Type": 'application/json',
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if(tokenId) {
    headers.tokenId = tokenId;
  }
  let body = {};
  headers = Object.assign({}, headers, header);
  body = Object.assign({}, body, data);
  body = queryString.stringify( body );
  options = {
    method: 'POST',
    body,
    headers
  };
  options = Object.assign({}, options);
  
  return request(url, options);
}
export default post;