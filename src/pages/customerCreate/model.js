import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'customerCreate';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    isLoading: false,
  },
  reducers,
  effects: {
    *create({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          isLoading: true,
        },
      });
      const response = yield call(api.customerCreate, payload);
      yield put({
        type: 'save',
        payload: {
          isLoading: false,
        },
      });
      switch (response.code) {
        case 0:
          Taro.navigateBack({
            delta: 1,
            complete() {
              Taro.atMessage({
                message: '客户添加成功！',
                type: 'success',
              });
            },
          });
          yield put({
            type: 'customerList/init',
          });
          break;
        default:
          Taro.atMessage({
            message: '客户添加失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
