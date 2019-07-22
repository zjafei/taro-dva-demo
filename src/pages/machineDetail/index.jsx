import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
// import dict from '@/utils/dict';
import { getFlexHeight, getAssets } from '@/utils';
import { Button, View, ScrollView, Text } from '@tarojs/components';
import {
  AtModal,
  AtModalContent,
  AtModalAction,
  AtActionSheet,
  AtActionSheetItem,
  AtList,
  AtListItem,
  AtIcon,
  AtButton,
} from 'taro-ui';
import PageWarp from '@/components/PageWarp';
import Item from '@/components/Form/Item';
import styles from './index.scss';

@connect(({ machineDetail }) => ({
  isLoading: machineDetail.isLoading,
  detail: machineDetail.detail,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '机械详情',
  };

  state = {
    isOpened: false,
    modalIsOpened: false,
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'machineDetail/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  componentDidShow = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'machineDetail/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  onShareAppMessage = () => {
    const { detail } = this.props;
    return {
      title: detail.name,
      path: `/pages/machineDetail/index?id=${this.$router.params.id}`,
    };
  };

  goToCustomerDetail = () => {
    const { detail } = this.props;
    Taro.navigateTo({
      url: `/pages/customerDetail/index?id=${detail.customerId}`,
    });
  };

  goToRepairOrderList = () => {
    const { detail } = this.props;
    // if (detail.repairCount) {
    Taro.navigateTo({
      url: `/pages/repairOrderList/index?machineText=${detail.name}&machineId=${this.$router.params.id}`,
    });
    // }
  };

  menuShow = () => {
    this.setState({
      isOpened: true,
    });
  };

  menuHidden = () => {
    this.setState({
      isOpened: false,
    });
  };

  modalShow = () => {
    this.setState({
      isOpened: false,
      modalIsOpened: true,
    });
  };

  modalHidden = () => {
    this.setState({
      modalIsOpened: false,
    });
  };

  modalOk = () => {
    const { dispatch } = this.props;
    this.modalHidden();
    dispatch({
      type: 'machineDetail/delete',
      payload: this.$router.params.id,
    });
  };

  showMore = () => {
    Taro.navigateTo({
      url: `/pages/machineDetailMore/index?id=${this.$router.params.id}`,
    });
  };

  edit = () => {
    this.setState({
      isOpened: false,
    });
    Taro.navigateTo({
      url: `/pages/machineEdit/index?id=${this.$router.params.id}`,
    });
  };

  render() {
    const { detail } = this.props;
    const { isOpened, modalIsOpened } = this.state;
    return (
      <PageWarp>
        <View className={styles.flex}>
          <View className={styles.head}>
            <View
              className={styles.image}
              style={{
                backgroundImage: `url('${detail.machinePhotoUrl ||
                  getAssets('/assets/images/noMachine.png')}')`,
              }}
            />
            <View className={styles.con}>
              <View className={styles.name}>{detail.name}</View>
              <View className={styles.info}>编号：{detail.code}</View>
            </View>
          </View>
          <ScrollView
            scrollY
            style={{
              height: `${getFlexHeight([90, 48])}px`,
            }}
          >
            <View className={styles.title}>客户信息</View>
            <View className={styles.card}>
              <View style={{ padding: '8px 0' }}>
                <Item hasBorder={false} title="客户名称">
                  {detail.customerName}
                  <Text className={styles.call} onClick={this.goToCustomerDetail}>
                    查看客户
                  </Text>
                </Item>
                <Item hasBorder={false} title="品牌">
                  {detail.brand || '--'}
                </Item>
                <Item hasBorder={false} title="型号">
                  {detail.machineModel || '--'}
                </Item>
                <Item hasBorder={false} title="铭牌编号">
                  {detail.nameplateNumber || '--'}
                </Item>
              </View>
              <View className={styles.showMore} onClick={this.showMore}>
                查看更多信息 <AtIcon value="chevron-right" size="14" />
              </View>
            </View>
            <View className={styles.title}>维修统计</View>
            <View className={styles.card}>
              <View className={`at-row ${styles.infoCon}`}>
                <View className="at-col">
                  <View className={styles.number}>--</View>
                  <View className={styles.info}>新建</View>
                </View>
                <View className="at-col">
                  <View className={styles.number}>--</View>
                  <View className={styles.info}>正在进行</View>
                </View>
                <View className="at-col">
                  <View className={styles.number}>--</View>
                  <View className={styles.info}>已完工</View>
                </View>
                <View className="at-col">
                  <View className={styles.number}>--</View>
                  <View className={styles.info}>待付款</View>
                </View>
                <View className="at-col">
                  <View className={styles.number}>--</View>
                  <View className={styles.info}>结算完毕</View>
                </View>
              </View>
            </View>
            <View className={styles.title}>结算统计</View>
            <View className={styles.card}>
              <View className={`at-row ${styles.infoCon}`}>
                <View className="at-col">
                  <View className={styles.number}>--</View>
                  <View className={styles.info}>总金额 (元)</View>
                </View>
                <View className="at-col">
                  <View className={styles.number}>--</View>
                  <View className={styles.info}>已付 (元)</View>
                </View>
                <View className="at-col">
                  <View className={styles.number} style={{ color: '#DF0000' }}>
                    --
                  </View>
                  <View className={styles.info}>待付 (元)</View>
                </View>
              </View>
            </View>
            <AtList className={styles.list} hasBorder={false}>
              <AtListItem
                thumb={getAssets('/assets/images/wxd.png')}
                title="维修单"
                extraText={detail.repairCount || '--'}
                arrow="right"
                onClick={this.goToRepairOrderList}
              />
              <AtListItem
                thumb={getAssets('/assets/images/jsd.png')}
                title="结算单"
                extraText="--"
                arrow="right"
              />
              <AtListItem
                thumb={getAssets('/assets/images/czrz.png')}
                title="操作日志"
                extraText="--"
                arrow="right"
                hasBorder={false}
              />
            </AtList>
          </ScrollView>

          <View className={`${styles.card} ${styles.foot} at-row`}>
            <View className="at-col" onClick={this.menuShow}>
              <View className={styles.more} />
              更多
            </View>
            <View className={`${styles.footEnd} at-col`}>
              <AtButton openType="share" className={styles.shareBtn}>
                <View className={styles.share} />
                分享
              </AtButton>
            </View>
          </View>
        </View>
        <AtActionSheet
          isOpened={isOpened}
          cancelText="取消"
          title="你可以对机械进行这些操作"
          className={styles.menu}
          onClose={this.menuHidden}
          onCancel={this.menuHidden}
        >
          <AtActionSheetItem onClick={this.edit}>编辑</AtActionSheetItem>
          <AtActionSheetItem onClick={this.modalShow}>
            <Text style={{ color: '#DF0000' }}>作废</Text>
          </AtActionSheetItem>
        </AtActionSheet>
        <AtModal isOpened={modalIsOpened} closeOnClickOverlay={false}>
          <AtModalContent>
            <View className={styles.confirmContent}>
              <AtIcon className={styles.confirmIcon} value="help" size="22" color="#DF0000" />
              你确定要作废该机械？
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.modalHidden}>取消</Button>
            <Button onClick={this.modalHidden}>确定</Button>
          </AtModalAction>
        </AtModal>
      </PageWarp>
    );
  }
}

export default Page;
