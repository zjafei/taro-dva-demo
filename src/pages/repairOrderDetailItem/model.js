import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'repairOrderDetailItem';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    isLoading: false,
  },
  reducers,
  effects: {
    *create({ payload, callback }, { call, put }) {
      const { data, orderId } = payload;
      yield put({
        type: 'save',
        payload: {
          isLoading: true,
        },
      });
      const response = yield call(api.repairOrderDetailCreateItem, orderId, data);
      yield put({
        type: 'save',
        payload: {
          isLoading: false,
        },
      });
      switch (response.code) {
        case 0:
          callback();
          Taro.atMessage({
            message: '维修单项目创建成功！',
            type: 'success',
          });
          yield put({
            type: 'repairOrderDetail/detail',
            payload: orderId,
          });
          break;
        default:
          Taro.atMessage({
            message: '维修单项目创建失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
    *delete({ payload }, { call, put }) {
      const { orderId, itemId } = payload;
      yield put({
        type: 'save',
        payload: {
          isLoading: true,
        },
      });
      const response = yield call(api.repairOrderDetailDelItem, orderId, itemId);
      yield put({
        type: 'save',
        payload: {
          isLoading: false,
        },
      });
      switch (response.code) {
        case 0:
          Taro.atMessage({
            message: '维修单项目删除成功！',
            type: 'success',
          });
          yield put({
            type: 'repairOrderDetail/detail',
            payload: orderId,
          });
          break;
        default:
          Taro.atMessage({
            message: '维修单项目删除失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
    *edit({ payload, callback }, { call, put }) {
      const { data, orderId, itemId } = payload;
      yield put({
        type: 'save',
        payload: {
          isLoading: true,
        },
      });
      const response = yield call(api.repairOrderDetailEditItem, orderId, itemId, data);
      yield put({
        type: 'save',
        payload: {
          isLoading: false,
        },
      });
      switch (response.code) {
        case 0:
          callback();
          Taro.atMessage({
            message: '维修单项目修改成功！',
            type: 'success',
          });
          yield put({
            type: 'repairOrderDetail/detail',
            payload: orderId,
          });
          break;
        default:
          Taro.atMessage({
            message: '维修单项目修改失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
