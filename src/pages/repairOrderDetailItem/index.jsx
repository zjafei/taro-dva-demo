import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import { getFlexHeight, toLocaleNumber } from '@/utils';
import { connect } from '@tarojs/redux';
import { AtSwipeAction, AtModal, AtModalContent, AtIcon, AtModalAction } from 'taro-ui';
import PageWarp from '@/components/PageWarp';
import RepairOrderDetailItemFrom from '@/components/RepairOrderDetailItemFrom';
import styles from './index.scss';

const defaultItemFromData = {
  name: null,
  unit: null, // 单位
  price: 0, // 价格
  num: 1, // 数量
};

@connect(({ repairOrderDetail }) => ({
  isLoading: repairOrderDetail.isLoading,
  detail: repairOrderDetail.detail,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '服务项目',
  };

  state = {
    current: {},
    modalIsOpened: false,

    isOpened: null,
    itemFromVisible: false,
    itemFromType: 'create',
    itemFromData: { ...defaultItemFromData },
  };

  modalOk = () => {
    const { dispatch } = this.props;
    const { current } = this.state;
    this.modalHidden();
    dispatch({
      type: 'repairOrderDetailItem/delete',
      payload: {
        orderId: this.$router.params.id,
        itemId: current.id,
      },
    });
  };

  modalShow = current => {
    this.setState({
      modalIsOpened: true,
      current,
    });
  };

  modalHidden = () => {
    this.setState({
      current: {},
      modalIsOpened: false,
    });
  };

  itemFromClose = () => {
    this.setState({
      itemFromVisible: false,
    });
  };

  itemFromOpen = () => {
    this.setState({
      itemFromVisible: true,
    });
  };

  itemFromCreate = () => {
    const { isLoading } = this.props;
    if (isLoading === false) {
      this.setState({
        current: {},
        itemFromType: 'create',
        itemFromData: { ...defaultItemFromData },
      });
      this.itemFromOpen();
    }
  };

  itemFromEdit = current => {
    const { isLoading } = this.props;
    if (isLoading === false) {
      this.setState({
        current,
        itemFromType: 'edit',
        itemFromData: {
          name: current.name,
          unit: current.unit, // 单位
          price: current.price, // 价格
          num: current.num, // 数量
        },
      });
      this.itemFromOpen();
    }
  };

  itemFromOk = data => {
    const { dispatch } = this.props;
    const { itemFromType, current } = this.state;
    dispatch({
      type: `repairOrderDetailItem/${itemFromType}`,
      payload: {
        orderId: this.$router.params.id,
        itemId: current.id,
        data,
      },
      callback: this.itemFromClose,
    });
  };

  render() {
    const { detail, isLoading } = this.props;
    const { modalIsOpened, itemFromVisible, itemFromType, itemFromData, isOpened } = this.state;
    return (
      <PageWarp>
        <View className={styles.title}>请设置本次维修的服务项目（向左划进行编辑）</View>
        <ScrollView
          scrollY
          style={{
            height: `${getFlexHeight([44, 48])}px`,
          }}
        >
          <View className={styles.card}>
            {detail.repairItems.map((item, index) => {
              return (
                <AtSwipeAction
                  key={item.id}
                  isOpened={isOpened === item.id}
                  onClick={e => {
                    this.setState({
                      isOpened: null,
                    });
                    switch (e.text) {
                      case '删除':
                        if (isLoading === false) {
                          this.modalShow(item);
                        }
                        break;
                      case '编辑':
                        if (isLoading === false) {
                          this.itemFromEdit(item);
                        }
                        break;
                      default:
                        break;
                    }
                  }}
                  onOpened={() => {
                    this.setState({
                      isOpened: item.id,
                    });
                  }}
                  onClosed={() => {
                    this.setState({
                      isOpened: null,
                    });
                  }}
                  options={[
                    // {
                    //   text: '删除',
                    //   style: {
                    //     backgroundColor: '#FF4949',
                    //   },
                    // },
                    {
                      text: '编辑',
                      style: {
                        backgroundColor: '#00C29E',
                      },
                    },
                  ]}
                >
                  <View
                    className={`${styles.item} ${
                      index === detail.repairItems.length - 1 ? styles.end : ''
                    }`}
                  >
                    <View
                      className={styles.image}
                      onClick={() => {
                        if (isLoading === false) {
                          this.modalShow(item);
                        }
                      }}
                    />
                    <View className={styles.con}>
                      <View className={styles.name}>{item.name}</View>
                      <View className={styles.info}>
                        <View>
                          单价：
                          <Text>¥{toLocaleNumber(item.price, 1)}</Text>
                        </View>
                        <View>
                          小计：
                          <Text>¥{toLocaleNumber(item.totalPrice, 1)}</Text>
                        </View>
                      </View>
                    </View>
                    <View className={styles.unit}>
                      {item.num} {item.unit}
                    </View>
                  </View>
                </AtSwipeAction>
              );
            })}
          </View>
        </ScrollView>
        <View className={`${styles.foot} at-row`}>
          <View className="at-col">合计：¥{toLocaleNumber(detail.totalPrice, 1)}</View>
          <View className={`${styles.footEnd} at-col`} onClick={this.itemFromCreate}>
            新增项目
          </View>
        </View>
        <AtModal isOpened={modalIsOpened} closeOnClickOverlay={false}>
          <AtModalContent>
            <View className={styles.confirmContent}>
              <AtIcon className={styles.confirmIcon} value="help" size="22" color="#DF0000" />
              你确定要作废该维修单？
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.modalHidden}>取消</Button>
            <Button onClick={this.modalOk}>确定</Button>
          </AtModalAction>
        </AtModal>
        <RepairOrderDetailItemFrom
          show={itemFromVisible}
          onOk={this.itemFromOk}
          onClose={this.itemFromClose}
          data={itemFromData}
          title={`${itemFromType === 'create' ? '新增' : '编辑'}服务项目`}
        />
      </PageWarp>
    );
  }
}

export default Page;
