import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'employeeDetail';
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
      const response = yield call(api.employeeDetail, payload);
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
            message: '人员信息获取失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(api.employeeDelete, payload);
      switch (response.code) {
        case 0:
          Taro.navigateBack({
            delta: 1,
            complete() {
              Taro.atMessage({
                message: '人员删除成功！',
                type: 'success',
              });
            },
          });
          yield put({
            type: 'employeeList/init',
          });
          break;
        default:
          Taro.atMessage({
            message: '人员删除失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
