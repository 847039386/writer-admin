import { query ,removeByID ,updateByID ,create } from '../services/category';

export default {
  namespace: 'category',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    e_data :{}
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
    *delete({ payload }, { call, put }) {
      const response = yield call(removeByID, payload);
      yield put({
        type: 'editor',
        payload: response,
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(updateByID, payload);
      yield put({
        type: 'editor',
        payload: response,
      });
    },
    *create({ payload }, { call, put }) {
      const response = yield call(create, payload);
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
