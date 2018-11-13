import { stringify } from 'qs';
import request from '../utils/request';


export async function query(params) {
  return request(`/v1/book/fd?${stringify(params)}`);
}


export async function removeByID(params) {
  return request('/v1/book/rm', {
    method: 'POST',
    body: params.body,
    headers: params.headers
  });
}


export async function updateByID(params) {
  return request('/v1/book/ut', {
    method: 'POST',
    body: params.body,
    headers: params.headers
  });
}

export async function create(params) {
  return request('/v1/book/ct', {
    method: 'POST',
    body: params.body,
    headers: params.headers
  });
}
