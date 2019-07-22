import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import { AtToast, AtFab, AtIcon } from 'taro-ui';
import { getAssets } from '@/utils';
import PageWarp from '@/components/PageWarp';
import CustomerItem from '@/components/CustomerItem';
import Empty from '@/components/Empty';
import NoMore from '@/components/NoMore';
import styles from './index.scss';

@connect(({ customerList }) => ({
  customerList,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '客户列表',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerList/init',
    });
  };

  // componentDidShow = () => {
  //   const {
  //     dispatch,
  //     customerList: { isLoading },
  //   } = this.props;
  //   if (isLoading === false) {
  //     dispatch({
  //       type: 'customerList/init',
  //     });
  //   }
  // };

  // 上拉刷新
  onPullDownRefresh = () => {
    const {
      dispatch,
      customerList: { isLoading },
    } = this.props;
    if (isLoading === false) {
      dispatch({
        type: 'customerList/init',
      });
    }
  };

  // 下拉加载
  onReachBottom = () => {
    const {
      dispatch,
      customerList: {
        isLoading,
        listParams: { page },
        list: { data, totalItemCount },
      },
    } = this.props;
    if (isLoading === false && data.length < totalItemCount) {
      dispatch({
        type: 'customerList/changeListParams',
        payload: {
          page: page + 1,
        },
      });
    }
  };

  create = () => {
    Taro.navigateTo({
      url: '/pages/customerCreate/index',
    });
  };

  goToDetail = id => {
    Taro.navigateTo({
      url: `/pages/customerDetail/index?id=${id}`,
    });
  };

  render() {
    const {
      customerList: {
        isLoading,
        list: { data, totalItemCount },
      },
    } = this.props;
    return (
      <PageWarp>
        {isLoading !== null ? ( // 是否加载过
          <View>
            {data.length === 0 ? ( // 是否为空
              <Empty icon={getAssets('/assets/images/noCustomer.png')} title="还没有客户" />
            ) : (
              <View>
                <View className={styles.list}>
                  {data.map(item => {
                    return (
                      <CustomerItem
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
