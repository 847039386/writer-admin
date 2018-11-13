import { query ,search ,lmtshow } from '../services/drama';

export default {
  namespace: 'drama',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    e_data : {}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      let newResponse = { list : [] , pagination :{}}
      if(response.success){
        newResponse = Object.assign(response.data)
      }
      yield put({
        type: 'save',
        payload: newResponse,
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(search, payload);
      let newResponse = { list : [] , pagination :{}}
      if(response.success){
        newResponse = Object.assign(response.data)
      }
      yield put({
        type: 'save',
        payload: newResponse,
      });
    },
    *lmtshow({ payload }, { call, put }) {
      const response = yield call(lmtshow, payload);
      yield put({
        type: 'editor',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    editor(state, action) {
      return {
        ...state,
        e_data: action.payload,
      };
    },
  },
};
