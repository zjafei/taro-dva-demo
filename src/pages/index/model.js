import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'indexPage';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    detail: {},
  },
  reducers,
  effects: {
    *getDetail(_, { call, put }) {
      const response = yield call(api.storeHome);
      switch (response.code) {
        case 0:
          yield put({
            type: 'save',
            payload: {
              detail: response.content,
            },
          });
          Taro.setStorageSync('store', response.content);
          break;
        default:
          Taro.atMessage({
            message: '店铺信息获取失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
