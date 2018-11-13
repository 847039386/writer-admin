import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin ,fakeAdminAccountLogin } from '../services/api';
import { setAuthority ,setAdmin } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    msg: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAdminAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.success) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          success : true,
          data : {
            authority :'guest'
          }
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if(payload.success){
        setAuthority(payload.data.authority);               // 当前权限
        setAdmin(payload.data)                              // 当前管理员
      }
      return {
        ...state,
        success : payload.success ? 'success' : 'error',
        msg: payload.msg,
      };
    },
  },
};
