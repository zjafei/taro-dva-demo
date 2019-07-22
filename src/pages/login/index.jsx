import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtButton, AtIcon, AtMessage } from 'taro-ui';
import { connect } from '@tarojs/redux';
import styles from './index.scss';

@connect(({ loading }) => ({
  isLoad: loading.effects['globalModel/login'],
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '登陆',
    enablePullDownRefresh: false,
  };

  getUserInfo = e => {
    if (e.detail.userInfo) {
      // 获取用户信息
      Taro.setStorageSync('user', e.detail.userInfo); // 当未认证的时候备用
      this.login();
    }
  };

  login = () => {
    const { dispatch } = this.props;
    Taro.login({
      // 获取openId
      success(res) {
        if (res.code) {
          // 获取openId
          dispatch({
            type: 'globalModel/login',
            payload: res.code,
          });
        }
      },
    });
  };

  render() {
    const { isLoad } = this.props;
    return (
      <View className={styles.loginPage}>
        <AtMessage />
        <View className={styles.logo} />
        <AtButton
          type="primary"
          className={styles.bigBtn}
          openType="getUserInfo"
          onGetUserInfo={this.getUserInfo}
          loading={isLoad}
        >
          <Text className={styles.icon} />
          微信用户快速登录
        </AtButton>
        <View className={styles.info}>
          <AtIcon value="alert-circle" size="13" color="#999" />
          请在提示中点击允许，以便您继续使用
        </View>
      </View>
    );
  }
}

export default Page;
