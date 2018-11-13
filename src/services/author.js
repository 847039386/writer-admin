import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/v1/us/list?${stringify(params)}`);
}

export async function details(params) {
  return request(`/v1/us/fdbi?${stringify(params)}`);
}

export async function constraintLogin(params) {
  return request('/v1/us/constraintLogin', {
    method: 'POST',
    body: params.body,
    headers: params.headers
  });
}

export async function search(params) {
  return request('/v1/us/asearch', {
    method: 'POST',
    body: params,
  });
}

