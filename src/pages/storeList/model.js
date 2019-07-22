import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'storeList';
const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    isLoading: null,
    isSelectLoading: false,
    list: [],
  },
  reducers,
  effects: {
    *getList(_, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          isLoading: true,
        },
      });
      const response = yield call(api.storeList);
      yield put({
        type: 'save',
        payload: {
          isLoading: false,
        },
      });
      switch (response.code) {
        case 0:
          if (response.content.stores !== null) {
            if (response.content.stores.length === 1) {
              Taro.setStorageSync('XAuthStoreUser', response.content.stores[0].userId);
              Taro.redirectTo({
                url: '/pages/index/index',
              });
            } else {
              yield put({
                type: 'save',
                payload: {
                  list: response.content.stores,
                },
              });
            }
          }
          break;

        default:
          break;
      }
    },

    *init(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          isLoading: null,
          list: [],
        },
      });
      yield put({
        type: 'getList',
      });
    },

    *selectStore({ payload }, { call, put, select }) {
      const { isSelectLoading } = yield select(selectState);
      if (isSelectLoading === false) {
        yield put({
          type: 'save',
          payload: {
            isSelectLoading: true,
          },
        });
        const response = yield call(api.storeSelect, payload);
        yield put({
          type: 'save',
          payload: {
            isSelectLoading: false,
          },
        });
        switch (response.code) {
          case 0:
            Taro.setStorageSync('XAuthStoreUser', payload);
            // 跳转到所选商铺
            Taro.redirectTo({
              url: '/pages/index/index',
              complete() {
                Taro.atMessage({
                  message: '选择商铺成功！',
                  type: 'success',
                });
              },
            });
            break;
          default:
            Taro.atMessage({
              message: '选择商铺失败，请稍后重新尝试！',
              type: 'error',
            });
            break;
        }
      }
    },
  },
};
