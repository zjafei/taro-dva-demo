import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import { AtMessage } from 'taro-ui';

@connect(({ globalModel }) => ({
  hasCheckUpdate: globalModel.hasCheckUpdate,
}))
class CustomComponent extends Component {
  state = {
    hasToken: false,
  };

  componentWillMount = () => {
    const { hasCheckUpdate } = this.props;
    if (wx.getUpdateManager && hasCheckUpdate === false) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel: false,
              success(r) {
                if (r.confirm) {
                  updateManager.applyUpdate();
                }
              },
            });
          });

          updateManager.onUpdateFailed(() => {
            wx.showToast({
              title: '新的版本下载失败！',
              icon: 'none',
            });
          });
        }
      });
    }
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    if (!Taro.getStorageSync('store')) {
      dispatch({
        type: 'indexPage/getDetail',
      });
    }

    if (!Taro.getStorageSync('xAuthToken')) {
      Taro.redirectTo({
        url: '/pages/login/index',
      });
    } else if (!Taro.getStorageSync('hasPhone')) {
      Taro.redirectTo({
        url: '/pages/verification/index',
      });
    } else if (!Taro.getStorageSync('XAuthStoreUser')) {
      Taro.redirectTo({
        url: '/pages/storeList/index',
      });
    } else if (!Taro.getStorageSync('systemInfo')) {
      Taro.getSystemInfo({
        success: res => {
          Taro.setStorageSync('systemInfo', res);
        },
        fail: () => {
          Taro.setStorageSync('systemInfo', null);
        },
        complete: () => {
          this.setState({
            hasToken: true,
          });
        },
      });
    } else {
      this.setState({
        hasToken: true,
      });
    }
  };

  render() {
    return (
      <View>
        <AtMessage />
        {this.state.hasToken === true && this.props.children}
      </View>
    );
  }
}

export default CustomComponent;
