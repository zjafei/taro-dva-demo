import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import { AtToast, AtFab, AtIcon } from 'taro-ui';
import { getAssets } from '@/utils';
import PageWarp from '@/components/PageWarp';
import RepairOrderItem from '@/components/RepairOrderItem';
import Empty from '@/components/Empty';
import NoMore from '@/components/NoMore';
import styles from './index.scss';

@connect(({ repairOrderList }) => ({
  repairOrderList,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '维修单列表',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    let id = null;
    let type = null;
    let title = '维修单列表';
    if (this.$router.params.customerId) {
      type = 'customer';
      title = '客户维修单列表';
      id = this.$router.params.customerId;
    }
    if (this.$router.params.employeeId) {
      type = 'employee';
      title = '人员维修单列表';
      id = this.$router.params.employeeId;
    }
    if (this.$router.params.machineId) {
      type = 'machine';
      title = '机械维修单列表';
      id = this.$router.params.machineId;
    }

    Taro.setNavigationBarTitle({
      title,
    });
    dispatch({
      type: 'repairOrderList/init',
      payload: {
        type,
        id,
      },
    });
  };

  // 上拉刷新
  onPullDownRefresh = () => {
    const {
      dispatch,
      repairOrderList: { isLoading },
    } = this.props;
    if (isLoading === false) {
      dispatch({
        type: 'repairOrderList/init',
      });
    }
  };

  // 下拉加载
  onReachBottom = () => {
    const {
      dispatch,
      repairOrderList: {
        isLoading,
        listParams: { page },
        list: { data, totalItemCount },
      },
    } = this.props;
    if (isLoading === false && data.length < totalItemCount) {
      dispatch({
        type: 'repairOrderList/changeListParams',
        payload: {
          page: page + 1,
        },
      });
    }
  };

  create = () => {
    let url = '/pages/repairOrderCreate/index';

    if (this.$router.params.employeeId) {
      url = `/pages/repairOrderCreate/index?employeeText=${this.$router.params.employeeText}&employeeId=${this.$router.params.employeeId}`;
    }

    if (this.$router.params.machineId) {
      url = `/pages/repairOrderCreate/index?machineText=${this.$router.params.machineText}&machineId=${this.$router.params.machineId}`;
    }

    Taro.navigateTo({
      url,
    });
  };

  goToDetail = id => {
    Taro.navigateTo({
      url: `/pages/repairOrderDetail/index?id=${id}`,
    });
  };

  render() {
    const {
      repairOrderList: {
        isLoading,
        list: { data, totalItemCount },
      },
    } = this.props;
    return (
      <PageWarp>
        {isLoading !== null ? ( // 是否加载过
          <View>
            {data.length === 0 ? ( // 是否为空
              <Empty icon={getAssets('/assets/images/noRepairOrder.png')} title="还没有维修单" />
            ) : (
              <View>
                <View className={styles.list}>
                  {data.map(item => {
                    return (
                      <RepairOrderItem
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
