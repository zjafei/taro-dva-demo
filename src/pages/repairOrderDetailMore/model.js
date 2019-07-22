import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'repairOrderDetailMore';
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
      const response = yield call(api.repairOrderDetailMore, payload);
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
            message: '维修单信息获取失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
