import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/v1/log/fdopid?${stringify(params)}`);
}

