import Taro, { Component } from '@tarojs/taro';
import { AtDrawer } from 'taro-ui';
import { getFlexHeight, getAssets } from '@/utils';
import { connect } from '@tarojs/redux';
import { View, ScrollView } from '@tarojs/components';
import Empty from '@/components/Empty';
import NoMore from '@/components/NoMore';
import styles from './index.scss';

function hasItem(list, item, field) {
  let cur = -1;
  for (let index = 0; index < list.length; index++) {
    if (item[field] === list[index][field]) {
      cur = index;
      break;
    }
  }
  return cur;
}

@connect(({ globalModel }) => ({
  globalModel,
}))
class CustomComponent extends Component {
  state = {
    selectList: [],
    selectListTemp: [],
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'globalModel/customerInit',
    });
  };

  componentDidUpdate = preProps => {
    if (JSON.stringify(preProps.selected) !== JSON.stringify(this.props.selected)) {
      this.setState({
        selectList: [...this.props.selected],
        selectListTemp: [...this.props.selected],
      });
    }
  };

  selectItem = item => {
    const { selectList } = this.state;
    const { multiple } = this.props;
    const index = hasItem(selectList, item, 'id');
    if (index === -1) {
      if (multiple === true) {
        selectList.push(item);
      } else {
        selectList[0] = item;
      }
    } else {
      selectList.splice(index, 1);
    }
    this.setState({
      selectList: [...selectList],
    });
  };

  close = () => {
    const { onClose } = this.props;
    const { selectListTemp } = this.state;
    this.setState({
      selectList: [...selectListTemp],
    });
    onClose();
  };

  ok = () => {
    const { onOk } = this.props;
    const { selectList } = this.state;
    this.setState({
      selectListTemp: [...selectList],
    });

    onOk(selectList);
  };

  // 下拉加载
  onReachBottom = () => {
    const {
      dispatch,
      globalModel: {
        customerIsLoading,
        customerList: { data, totalItemCount },
        customerListParams: { page },
      },
    } = this.props;
    if (customerIsLoading === false && data.length < totalItemCount) {
      dispatch({
        type: 'globalModel/customerChangeListParams',
        payload: {
          page: page + 1,
        },
      });
    }
  };

  render() {
    const {
      show,
      title,
      globalModel: {
        customerIsLoading,
        customerList: { data, totalItemCount },
      },
    } = this.props;
    const { selectList } = this.state;
    const list = data.map(item => {
      return (
        <View key={item.id} className={styles.item} onClick={this.selectItem.bind(this, item)}>
          <View
            className={styles.image}
            style={{
              backgroundImage: `url('${item.avatarUrl ||
                getAssets('/assets/images/noCustomer.png')}')`,
            }}
          />
          <View className={styles.itemCon}>
            <View className={styles.name}>{item.name}</View>
            <View className={styles.contact}>{item.contactPhone}</View>
            {hasItem(selectList, item, 'id') !== -1 && <View className={styles.selected} />}
          </View>
        </View>
      );
    });
    return (
      <AtDrawer right show={show} width="320px" mask onClose={this.close}>
        <View className={styles.con}>
          <View className={styles.title}>{title}</View>
          <ScrollView
            onScrollToLower={this.onReachBottom}
            scrollY
            style={{
              height: `${getFlexHeight([44, 48])}px`,
            }}
          >
            {customerIsLoading !== null ? ( // 是否加载过
              data.length === 0 ? ( // 是否为空
                <Empty icon={getAssets('/assets/images/noCustomer.png')} title="还没有客户" />
              ) : (
                <View>
                  {list}
                  <NoMore visible={customerIsLoading === false && data.length >= totalItemCount} />
                </View>
              )
            ) : null}
          </ScrollView>
          <View className={styles.footer}>
            <View className={styles.close} onClick={this.close}>
              返回
            </View>
            <View onClick={this.ok} className={styles.ok}>
              确定
            </View>
          </View>
        </View>
      </AtDrawer>
    );
  }
}

CustomComponent.defaultProps = {
  show: false,
  selected: [],
  multiple: false,
  title: '请选择客户',
  onOk: () => {},
  onClose: () => {},
};

export default CustomComponent;
