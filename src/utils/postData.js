
import queryString from 'query-string';

import request from './request';
import Cache from './cache';

import fetch from 'dva/fetch';

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
    // "Content-Type": 'multipart/form-data',
  };
  if(tokenId) {
    headers['X-Token'] = tokenId;
  }
  let body = {};
  headers = Object.assign({}, headers, header);
  body = data;
  options = {
    method: 'POST',
    body,
    headers
  };
  options = Object.assign({}, options);
  
  return request(url, options);
  // return req(url, options);
}

function checkStatus(response) {
  console.log('res', response)
  response.body.getReader().read().then(e => {
    console.log(e, '00000')
  })
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function req(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    // .then(parseJSON)
    .then(data => ({data}))
    .catch(err => ({ err }));
}

export default post;