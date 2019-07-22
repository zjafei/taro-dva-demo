import reducers from '@/utils/reducers';
// import api from '@/server/api';

const namespace = 'login';
// const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    // test: namespace,
  },
  reducers,
  effects: {
    // *load(_, { call, put, select }) {
    //   const { test } = yield select(selectState);
    //   const response = yield call(api.demo, { test });
    //   switch (response.code) {
    //     case 0:
    //       yield put({
    //         type: 'save',
    //         payload: {
    //           test: response.data,
    //         },
    //       });
    //       break;
    //     default:
    //       break;
    //   }
    // },
  },
};
