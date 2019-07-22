import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'repairOrderEdit';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    isLoading: null,
    data: {
      machineId: null,
      machineText: null,

      employeeId: null,
      employeeText: null,

      enterTime: null,
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
      const response = yield call(api.repairOrderDetail, payload);
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
              data: {
                machineId: response.content.machineId,
                machineText: response.content.machineName,

                employeeId: response.content.employeeId,
                employeeText: response.content.employeeName,

                enterTime: response.content.enterTime,
              },
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
      const response = yield call(api.repairOrderEdit, id, payload);
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
                message: '维修单编辑成功！',
                type: 'success',
              });
            },
          });
          yield put({
            type: 'repairOrderList/init',
          });
          break;
        default:
          Taro.atMessage({
            message: '维修单编辑失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
