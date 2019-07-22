import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'employeeEdit';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    isLoading: null,
    data: {
      avatarPath: [],
      phone: null,
      name: null,
    },
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
              data: response.content,
            },
          });
          break;
        default:
          break;
      }
    },
    *edit({ id, payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          isLoading: true,
        },
      });
      const response = yield call(api.employeeEdit, id, payload);
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
                message: '人员编辑成功！',
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
            message: '人员编辑失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
