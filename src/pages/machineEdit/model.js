import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = 'machineEdit';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    isLoading: null,
    data: {
      customerId: null,
      customerText: null,

      machinePhotoList: [],
      machinePhoto: null,

      name: null,
      brand: null,
      machineModel: null,
      nameplateNumber: null,
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
              data: {
                customerId: response.content.customerId,
                customerText: response.content.customerName,

                machinePhotoList: response.content.machinePhotoPath
                  ? [
                      {
                        path: response.content.machinePhotoPath,
                        url: response.content.machinePhotoUrl,
                      },
                    ]
                  : [],
                machinePhoto: response.content.machinePhotoPath,

                name: response.content.name,
                brand: response.content.brand,
                machineModel: response.content.machineModel,
                nameplateNumber: response.content.nameplateNumber,
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
      const response = yield call(api.machineEdit, id, payload);
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
                message: '机械编辑成功！',
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
            message: '机械编辑失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },
  },
};
