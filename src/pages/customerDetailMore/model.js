import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'customerDetailMore';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    isLoading: null,
    detail: {},
  },
  reducers,
  effects: {
    *detail({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          isLoading: true,
        },
      });
      const response = yield call(api.customerDetailMore, payload);
      yield put({
        type: 'save',
        payload: {
          isLoading: false,
        },
      });
      switch (response.code) {
        case 0:
          yield put({
            type: 'save',
            payload: {
              detail: response.content,
            },
          });
          break;
        default:
          Taro.atMessage({
            message: '客户信息获取失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
