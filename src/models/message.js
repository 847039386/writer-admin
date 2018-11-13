import { create } from '../services/message';

export default {
  namespace: 'message',

  state: {
    e_data :{}
  },

  effects: {
    *create({ payload }, { call, put }) {
      const response = yield call(create, payload);
      yield put({
        type: 'editor',
        payload: response,
      });
    },
  },

  reducers: {
    editor(state, action) {
      return {
        ...state,
        e_data: action.payload,
      };
    },
  },
};
