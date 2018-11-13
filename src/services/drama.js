import { stringify } from 'qs';
import request from '../utils/request';



export async function query(params) {
  return request(`/v1/drama/fd?${stringify(params)}`);
}

export async function search(params) {
  return request('/v1/drama/search', {
    method: 'POST',
    body: params,
  });
}

export async function lmtshow(params) {
  return request('/v1/drama/lmtshow', {
    method: 'POST',
    body: params.body,
    headers: params.headers
  });
}