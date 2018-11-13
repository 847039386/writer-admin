import { stringify } from 'qs';
import request from '../utils/request';

export async function create(params) {
  return request('/v1/notify/adminPrivateLetter', {
    method: 'POST',
    body: params.body,
    headers: params.headers
  });
}
