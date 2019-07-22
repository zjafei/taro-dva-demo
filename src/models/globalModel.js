import Taro from '@tarojs/taro';
import reducers from '@/utils/reducers';
import api from '@/server/api';
// import dict from '@/utils/dict';

const namespace = 'globalModel';
const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    hasCheckUpdate: false,
    passport: null,
    // userId: null, // 当userId有值时，不需要选择商家
    // authorities: [],

    customerIsLoading: null,
    customerListParams: {
      page: 1,
    },
    customerList: {
      data: [],
      totalItemCount: 0,
    },

    machineIsLoading: null,
    machineListParams: {
      page: 1,
    },
    machineList: {
      data: [],
      totalItemCount: 0,
    },

    employeeIsLoading: null,
    employeeListParams: {
      page: 1,
    },
    employeeList: {
      data: [],
      totalItemCount: 0,
    },
  },
  reducers,
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(api.login, payload);
      // const hasAuth = false;
      switch (response.code) {
        case 0:
          Taro.setStorageSync('xAuthToken', response.content['X-Auth-Token']);
          // 是否认证
          if (response.content.passport && response.content.passport.phone) {
            // 查看权限
            // for (let index = 0; index < response.content.authorities.length; index++) {
            //   if (
            //     Object.keys(dict.authorities).indexOf(
            //       response.content.authorities[index].authority
            //     ) !== -1
            //   ) {
            //     hasAuth = true;
            //   }
            // }
            // if (hasAuth === true) {
            Taro.setStorageSync('hasPhone', true);
            yield put({
              type: 'save',
              payload: {
                passport: response.content.passport,
                // userId: response.content.userId,
                // authorities: response.content.authorities,
              },
            });
            if (response.content.userId) {
              // 以绑定商家
              Taro.setStorageSync('XAuthStoreUser', response.content.userId);
              Taro.redirectTo({
                url: '/pages/index/index',
              });
            } else {
              // 未绑定商家
              Taro.redirectTo({
                url: '/pages/storeList/index',
              });
            }
            // } else {
            //   // 没有权限
            //   Taro.atMessage({
            //     message: '没有使用权限',
            //     type: 'error',
            //   });
            // }
          } else {
            // 没有电话跳转到认证页面
            Taro.redirectTo({
              url: '/pages/verification/index',
            });
          }
          break;
        default:
          Taro.atMessage({
            message: '登陆失败，请稍后重试！',
            type: 'error',
          });
          break;
      }
    },

    *customerGetList(_, { call, put, select }) {
      const { customerListParams, customerList } = yield select(selectState);
      yield put({
        type: 'save',
        payload: {
          customerIsLoading: true,
        },
      });
      const response = yield call(api.customerSelectItemList, customerListParams);
      Taro.stopPullDownRefresh();
      yield put({
        type: 'save',
        payload: {
          customerIsLoading: false,
        },
      });
      switch (response.code) {
        case 0:
          if (customerListParams.page > 1) {
            response.content.data = [...customerList.data, ...response.content.data];
          }
          yield put({
            type: 'save',
            payload: {
              customerList: response.content,
            },
          });
          break;
        default:
          break;
      }
    },

    *customerChangeListParams({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          name: 'customerListParams',
          value: {
            ...payload,
          },
        },
      });
      yield put({
        type: 'customerGetList',
      });
    },

    *customerInit(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          customerIsLoading: null,
          customerListParams: {
            page: 1,
          },
        },
      });
      yield put({
        type: 'customerGetList',
      });
    },

    *machineGetList(_, { call, put, select }) {
      const { machineListParams, machineList } = yield select(selectState);
      yield put({
        type: 'save',
        payload: {
          machineIsLoading: true,
        },
      });
      const response = yield call(api.machineSelectItemList, machineListParams);
      Taro.stopPullDownRefresh();
      yield put({
        type: 'save',
        payload: {
          machineIsLoading: false,
        },
      });
      switch (response.code) {
        case 0:
          if (machineListParams.page > 1) {
            response.content.data = [...machineList.data, ...response.content.data];
          }
          yield put({
            type: 'save',
            payload: {
              machineList: response.content,
            },
          });
          break;
        default:
          break;
      }
    },

    *machineChangeListParams({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          name: 'machineListParams',
          value: {
            ...payload,
          },
        },
      });
      yield put({
        type: 'machineGetList',
      });
    },

    *machineInit(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          machineIsLoading: null,
          machineListParams: {
            page: 1,
          },
        },
      });
      yield put({
        type: 'machineGetList',
      });
    },

    *employeeGetList(_, { call, put, select }) {
      const { employeeListParams, employeeList } = yield select(selectState);
      yield put({
        type: 'save',
        payload: {
          employeeIsLoading: true,
        },
      });
      const response = yield call(api.employeeSelectItemList, employeeListParams);
      Taro.stopPullDownRefresh();
      yield put({
        type: 'save',
        payload: {
          employeeIsLoading: false,
        },
      });
      switch (response.code) {
        case 0:
          if (employeeListParams.page > 1) {
            response.content.data = [...employeeList.data, ...response.content.data];
          }
          yield put({
            type: 'save',
            payload: {
              employeeList: response.content,
            },
          });
          break;
        default:
          break;
      }
    },

    *employeeChangeListParams({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          name: 'employeeListParams',
          value: {
            ...payload,
          },
        },
      });
      yield put({
        type: 'employeeGetList',
      });
    },

    *employeeInit(_, { put }) {
      yield put({
        type: 'save',
        payload: {
          employeeIsLoading: null,
          employeeListParams: {
            page: 1,
          },
        },
      });
      yield put({
        type: 'employeeGetList',
      });
    },

    *error({ payload }) {
      const { e } = payload;
      console.log(e);
    },
  },
};
