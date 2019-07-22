import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
// import { delay } from '@/utils';
import api from '@/server/api';

const namespace = 'repairOrderDetail';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    isLoading: false,
    detail: {
      startTime: null,
      finishTime: null,
      repairItems: [],
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
      // yield delay(1000);
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
    *setState({ payload, callback }, { call, put }) {
      const { id, params } = payload;
      const response = yield call(api.repairOrderDetailState, id, params);
      switch (response.code) {
        case 0:
          Taro.atMessage({
            message: '维修单进度设置成功！',
            type: 'success',
          });
          callback();
          yield put({
            type: 'detail',
            payload: id,
          });
          break;
        default:
          Taro.atMessage({
            message: '维修单进度设置失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(api.repairOrderDelete, payload);
      switch (response.code) {
        case 0:
          Taro.navigateBack({
            delta: 1,
            complete() {
              Taro.atMessage({
                message: '维修单删除成功！',
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
            message: '维修单删除失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
