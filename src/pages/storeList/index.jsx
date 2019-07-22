import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtToast, AtList, AtListItem } from 'taro-ui';
// import PageWarp from '@/components/PageWarp';
import Empty from '@/components/Empty';
// import NoMore from '@/components/NoMore';
import { getAssets } from '@/utils';

import styles from './index.scss';

@connect(({ storeList }) => ({
  storeList,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '选择商家',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storeList/init',
    });
  };

  componentDidShow = () => {
    const {
      dispatch,
      storeList: { isLoading },
    } = this.props;
    if (isLoading === false) {
      dispatch({
        type: 'storeList/init',
      });
    }
  };

  // 上拉刷新
  onPullDownRefresh = () => {
    const {
      dispatch,
      storeList: { isLoading },
    } = this.props;
    if (isLoading === false) {
      dispatch({
        type: 'storeList/init',
      });
    }
  };

  selectStore = userId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storeList/selectStore',
      payload: userId,
    });
  };

  callPhone = () => {
    Taro.makePhoneCall({
      phoneNumber: '18168400530',
    });
  };

  render() {
    const {
      storeList: { isLoading, list },
    } = this.props;
    return (
      <View>
        {isLoading !== null && ( // 是否加载过
          <View className={styles.storePage}>
            {list.length === 0 ? ( // 是否为空
              <Empty icon={getAssets('/assets/images/no-store.png')} title="没有加入的商家">
                如需试用，请联系客服电话：
                <Text className={styles.phone} onClick={this.callPhone}>
                  18168400530
                </Text>
              </Empty>
            ) : (
              <View>
                <View className={styles.title}>我加入的商家</View>
                <AtList className={styles.list} hasBorder={false}>
                  {list.map(item => {
                    return (
                      <AtListItem
                        key={item.userId}
                        title={item.name}
                        thumb={item.iconUrl}
                        onClick={() => {
                          this.selectStore(item.userId);
                        }}
                        arrow="right"
                      />
                    );
                  })}
                </AtList>
              </View>
            )}
          </View>
        )}
        {(isLoading === null || isLoading === true) && (
          <AtToast hasMask isOpened text="页面加载中..." duration={0} status="loading" />
        )}
      </View>
    );
  }
}

export default Page;
