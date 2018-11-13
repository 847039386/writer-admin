import { stringify } from 'qs';
import request from '../utils/request';


export async function query(params) {
  return request(`/v1/category/fd?${stringify(params)}`);
}


export async function removeByID(params) {
  return request('/v1/category/rm', {
    method: 'POST',
    body: params.body,
    headers: params.headers
  });
}


export async function updateByID(params) {
  return request('/v1/category/ut', {
    method: 'POST',
    body: params.body,
    headers: params.headers
  });
}

export async function create(params) {
  return request('/v1/category/ct', {
    method: 'POST',
    body: params.body,
    headers: params.headers
  });
}
