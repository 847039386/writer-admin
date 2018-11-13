import { query ,details ,constraintLogin ,search } from '../services/author';

export default {
  namespace: 'author',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    details : { }
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
    *details({ payload }, { call, put }) {
      const response = yield call(details, payload);
      yield put({
        type: 'editor',
        payload: response.data,
      });
    },
    *constraintLogin({ payload }, { call, put }) {
      const response = yield call(constraintLogin, payload);
      yield put({
        type: 'editor',
        payload: response.data,
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
        details: action.payload,
      };
    },
  },
};