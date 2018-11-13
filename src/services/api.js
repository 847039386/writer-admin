import { stringify } from 'qs';
import request from '../utils/request';

export async function queryNotices() {
  return request('/api/notices');
}

export async function fakeAdminAccountLogin(params) {
  return request('/v1/adm/lg', {
    method: 'POST',
    body: params,
  });
}

export async function baiduApiSiteList(params) {
  return request('https://api.baidu.com/json/tongji/v1/ReportService/getData', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/v1/api/fake_chart_data');
}
