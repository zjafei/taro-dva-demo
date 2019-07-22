import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import { AtGrid } from 'taro-ui';
import PageWarp from '@/components/PageWarp';
import { getAssets } from '@/utils';
import styles from './index.scss';

const menuMap = {
  客户: 'customerList',
  机械: 'machineList',
  人员: 'employeeList',
  维修单: 'repairOrderList',
};

@connect(({ indexPage, loading }) => ({
  isLoading: loading.effects['indexPage/getDetail'],
  indexPage,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '首页',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'indexPage/getDetail',
    });
  };

  componentDidShow = () => {
    const { dispatch, isLoading } = this.props;
    if (!isLoading) {
      dispatch({
        type: 'indexPage/getDetail',
      });
    }
  };

  onShareAppMessage = () => {
    return {
      title: '机匠',
      path: '/pages/index/index',
    };
  };

  clickMenu = e => {
    if (menuMap[e.value]) {
      Taro.navigateTo({
        url: `/pages/${menuMap[e.value]}/index`,
      });
    } else {
      // 敬请期待
      Taro.showToast({
        title: '敬请期待',
        icon: 'none',
        duration: 1000,
      });
    }
  };

  render() {
    const {
      indexPage: { detail },
    } = this.props;
    return (
      <PageWarp>
        <View className={styles.bg}>
          <View
            className={styles.icon}
            style={{
              backgroundImage: `url('${detail.iconUrl ||
                Taro.getStorageSync('user').avatarUrl ||
                getAssets('/assets/images/avatar.png')}')`,
            }}
          />
          <View className={styles.title}>{detail.name}</View>
        </View>
        <View className={`at-row ${styles.infoCon}`}>
          <View className="at-col at-col-3">
            <View className={styles.number}>{detail.customerCount || '--'}</View>
            <View className={styles.info}>客户</View>
          </View>
          <View className="at-col at-col-3">
            <View className={styles.number}>{detail.machineCount || '--'}</View>
            <View className={styles.info}>机械</View>
          </View>
          <View className="at-col at-col-3">
            <View className={styles.number}>{detail.repairCount || '--'}</View>
            <View className={styles.info}>维修单</View>
          </View>
          <View className="at-col at-col-3">
            <View className={styles.number}>--</View>
            <View className={styles.info}>结算单</View>
          </View>
        </View>
        <View className={styles.menu}>
          <AtGrid
            onClick={this.clickMenu}
            data={[
              {
                image: getAssets('/assets/images/kh.png'),
                value: '客户',
              },
              {
                image: getAssets('/assets/images/jx.png'),
                value: '机械',
              },
              {
                image: getAssets('/assets/images/wxd.png'),
                value: '维修单',
              },
              {
                image: getAssets('/assets/images/jsd.png'),
                value: '结算单',
              },
              {
                image: getAssets('/assets/images/ry.png'),
                value: '人员',
              },
              {
                image: getAssets('/assets/images/sz.png'),
                value: '设置',
              },
            ]}
          />
        </View>
      </PageWarp>
    );
  }
}

export default Page;
