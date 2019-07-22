import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtToast, AtFab, AtIcon } from 'taro-ui';
import { getAssets } from '@/utils';
import PageWarp from '@/components/PageWarp';
import MachineItem from '@/components/MachineItem';
import Empty from '@/components/Empty';
import NoMore from '@/components/NoMore';
import styles from './index.scss';

@connect(({ machineList }) => ({
  machineList,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '机械列表',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    Taro.setNavigationBarTitle({
      title: this.$router.params.customerId ? '客户机械列表' : '机械列表',
    });
    dispatch({
      type: 'machineList/init',
      payload: this.$router.params.customerId || null,
    });
  };

  // 上拉刷新
  onPullDownRefresh = () => {
    const {
      dispatch,
      machineList: { isLoading },
    } = this.props;
    if (isLoading === false) {
      dispatch({
        type: 'machineList/init',
      });
    }
  };

  // 下拉加载
  onReachBottom = () => {
    const {
      dispatch,
      machineList: {
        isLoading,
        listParams: { page },
        list: { data, totalItemCount },
      },
    } = this.props;
    if (isLoading === false && data.length < totalItemCount) {
      dispatch({
        type: 'machineList/changeListParams',
        payload: {
          page: page + 1,
        },
      });
    }
  };

  create = () => {
    const url = this.$router.params.customerId
      ? `/pages/machineCreate/index?customerText=${this.$router.params.customerText}&customerId=${this.$router.params.customerId}`
      : '/pages/machineCreate/index';
    Taro.navigateTo({
      url,
    });
  };

  goToDetail = id => {
    Taro.navigateTo({
      url: `/pages/machineDetail/index?id=${id}`,
    });
  };

  render() {
    const {
      machineList: {
        isLoading,
        list: { data, totalItemCount },
      },
    } = this.props;

    return (
      <PageWarp>
        {isLoading !== null ? ( // 是否加载过
          <View>
            {data.length === 0 ? ( // 是否为空
              <Empty icon={getAssets('/assets/images/noMachine.png')} title="还没有机械" />
            ) : (
              <View>
                <View className={styles.list}>
                  {data.map(item => {
                    return (
                      <MachineItem
                        key={item.id}
                        data={item}
                        onClick={() => {
                          this.goToDetail(item.id);
                        }}
                      />
                    );
                  })}
                </View>
                <NoMore visible={isLoading === false && data.length >= totalItemCount} />
              </View>
            )}
            <View className={styles.add}>
              <AtFab onClick={this.create}>
                <AtIcon value="add" />
              </AtFab>
            </View>
          </View>
        ) : null}
        {(isLoading === null || isLoading === true) && (
          <AtToast hasMask isOpened text="页面加载中..." duration={0} status="loading" />
        )}
      </PageWarp>
    );
  }
}

export default Page;
