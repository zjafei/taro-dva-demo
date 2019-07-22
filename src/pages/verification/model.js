import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';
import { clearAuth } from '@/utils';

const namespace = 'verification';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {},
  reducers,
  effects: {
    *wxPhone({ payload }, { call }) {
      const response = yield call(api.wxPhone, payload);
      switch (response.code) {
        case 0:
          Taro.setStorageSync('hasPhone', true);
          if (Taro.getStorageSync('XAuthStoreUser')) {
            Taro.redirectTo({
              url: '/pages/index/index',
            });
          } else {
            Taro.redirectTo({
              url: '/pages/storeList/index',
            });
          }
          break;
        default:
          Taro.atMessage({
            message: '手机认证失败，请稍后重试！',
            type: 'error',
          });
          clearAuth();
          break;
      }
    },
  },
};
