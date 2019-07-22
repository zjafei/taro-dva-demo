import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'machineList';
const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    isLoading: null,
    listParams: {
      page: 1,
      customerId: null,
    },
    list: {
      data: [],
      totalItemCount: 0,
    },
  },
  reducers,
  effects: {
    *getList(_, { call, put, select }) {
      const {
        listParams: { customerId, ...params },
        list,
      } = yield select(selectState);
      yield put({
        type: 'save',
        payload: {
          isLoading: true,
        },
      });
      const response = yield call(api.machineList, customerId, params);
      Taro.stopPullDownRefresh();
      yield put({
        type: 'save',
        payload: {
          isLoading: false,
        },
      });
      switch (response.code) {
        case 0:
          if (params.page > 1) {
            response.content.data = [...list.data, ...response.content.data];
          }
          yield put({
            type: 'save',
            payload: {
              list: response.content,
            },
          });
          break;
        default:
          break;
      }
    },

    *changeListParams({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          name: 'listParams',
          value: {
            ...payload,
          },
        },
      });
      yield put({
        type: 'getList',
      });
    },

    *init({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          isLoading: null,
          listParams: {
            page: 1,
            customerId: payload,
          },
        },
      });
      yield put({
        type: 'getList',
      });
    },
  },
};
