import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { AtToast, AtFab, AtIcon } from 'taro-ui';
import { getAssets } from '@/utils';
import PageWarp from '@/components/PageWarp';
import EmployeeItem from '@/components/EmployeeItem';
import Empty from '@/components/Empty';
import NoMore from '@/components/NoMore';
import styles from './index.scss';

@connect(({ employeeList }) => ({
  employeeList,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '人员列表',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeList/init',
    });
  };

  // 上拉刷新
  onPullDownRefresh = () => {
    const {
      dispatch,
      employeeList: { isLoading },
    } = this.props;
    if (isLoading === false) {
      dispatch({
        type: 'employeeList/init',
      });
    }
  };

  // 下拉加载
  onReachBottom = () => {
    const {
      dispatch,
      employeeList: {
        isLoading,
        listParams: { page },
        list: { data, totalItemCount },
      },
    } = this.props;
    if (isLoading === false && data.length < totalItemCount) {
      dispatch({
        type: 'employeeList/changeListParams',
        payload: {
          page: page + 1,
        },
      });
    }
  };

  create = () => {
    Taro.navigateTo({
      url: '/pages/employeeCreate/index',
    });
  };

  goToDetail = id => {
    Taro.navigateTo({
      url: `/pages/employeeDetail/index?id=${id}`,
    });
  };

  render() {
    const {
      employeeList: {
        isLoading,
        list: { data, totalItemCount },
      },
    } = this.props;

    return (
      <PageWarp>
        {isLoading !== null ? ( // 是否加载过
          <View>
            {data.length === 0 ? ( // 是否为空
              <Empty icon={getAssets('/assets/images/noAvatar.png')} title="还没有人员" />
            ) : (
              <View>
                <View className={styles.list}>
                  {data.map(item => {
                    return (
                      <EmployeeItem
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
