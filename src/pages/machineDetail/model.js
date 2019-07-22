import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'machineDetail';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    isLoading: false,
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
      const response = yield call(api.machineDetail, payload);
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
            message: '机械信息获取失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(api.machineDelete, payload);
      switch (response.code) {
        case 0:
          Taro.navigateBack({
            delta: 1,
            complete() {
              Taro.atMessage({
                message: '机械删除成功！',
                type: 'success',
              });
            },
          });
          yield put({
            type: 'machineList/init',
          });
          break;
        default:
          Taro.atMessage({
            message: '机械删除失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
