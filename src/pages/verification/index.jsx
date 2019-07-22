import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtMessage, AtButton, AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import styles from './index.scss';

@connect(({ loading }) => ({
  isLoad: loading.effects['verification/wxPhone'],
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '验证手机号码',
    enablePullDownRefresh: false,
  };

  getPhoneNumber = e => {
    const { dispatch } = this.props;
    if (e.detail && e.detail.encryptedData && e.detail.iv) {
      delete e.detail.errMsg;
      const user = Taro.getStorageSync('user');
      dispatch({
        type: 'verification/wxPhone',
        payload: {
          ...e.detail,
          ...user,
        },
      });
    }
  };

  render() {
    const { isLoad } = this.props;
    return (
      <View className={styles.verificationPage}>
        <View className={styles.logo} />
        <AtButton
          type="primary"
          className={styles.bigBtn}
          openType="getPhoneNumber"
          onGetPhoneNumber={this.getPhoneNumber}
          loading={isLoad}
        >
          快速验证
        </AtButton>
        <View className={styles.info}>
          <AtIcon value="alert-circle" size="13" color="#999" />
          请在提示中点击允许，以便您继续使用
        </View>
        <AtMessage />
      </View>
    );
  }
}

export default Page;
