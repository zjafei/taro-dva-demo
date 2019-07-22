import '@tarojs/async-await';
import { Provider } from '@tarojs/redux';
import Taro, { Component } from '@tarojs/taro';
import Index from '@/pages/index';
import dva from '@/utils/dva';
import models from '@/models';
import './app.global.scss';

const dvaApp = dva.createApp({
  initialState: {},
  models,
  onError(e, dispatch) {
    dispatch({
      type: 'globalModel/error',
      payload: e,
    });
  },
});

global.__APP__ = dvaApp;

const store = dvaApp.getStore();

class App extends Component {
  config = {
    pages: [
      // <?=pageList=?>
      'pages/index/index',
      'pages/customerCreate/index',
      'pages/customerDetail/index',
      'pages/customerDetailMore/index',
      'pages/customerEdit/index',
      'pages/customerList/index',
      'pages/employeeCreate/index',
      'pages/employeeDetail/index',
      'pages/employeeDetailMore/index',
      'pages/employeeEdit/index',
      'pages/employeeList/index',
      'pages/login/index',
      'pages/machineCreate/index',
      'pages/machineDetail/index',
      'pages/machineDetailMore/index',
      'pages/machineEdit/index',
      'pages/machineList/index',
      'pages/repairOrderCreate/index',
      'pages/repairOrderDetail/index',
      'pages/repairOrderDetailItem/index',
      'pages/repairOrderDetailMore/index',
      'pages/repairOrderEdit/index',
      'pages/repairOrderList/index',
      'pages/storeList/index',
      'pages/verification/index',
      // <?=pageList=?>
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#385ee8',
      navigationBarTextStyle: 'white',
      enablePullDownRefresh: true,
    },
  };

  componentDidMount() {
    // dvaApp.dispatch({ type: 'sys/test' });
  }

  componentDidShow = () => {};

  componentDidHide = () => {};

  componentCatchError = () => {};

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
