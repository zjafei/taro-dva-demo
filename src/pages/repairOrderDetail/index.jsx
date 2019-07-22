import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import moment from 'moment';
import { getAssets, toLocaleNumber, getFlexHeight } from '@/utils';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import {
  AtList,
  AtButton,
  AtListItem,
  AtActionSheet,
  AtActionSheetItem,
  AtModal,
  AtModalContent,
  AtIcon,
  AtModalAction,
} from 'taro-ui';
import PageWarp from '@/components/PageWarp';
import RepairOrderDetailItem from '@/components/RepairOrderDetailItem';
import DateTimeRange from '@/components/DateTimeRange';
import Step from '@/components/Step';
import styles from './index.scss';

@connect(({ repairOrderDetail }) => ({
  isLoading: repairOrderDetail.isLoading,
  detail: repairOrderDetail.detail,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#004276',
  };

  state = {
    isOpened: false,
    modalIsOpened: false,
    payModalIsOpened: false,
    dataTimeSelectVisible: false,
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairOrderDetail/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  componentDidShow = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairOrderDetail/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  onShareAppMessage = () => {
    const { detail } = this.props;
    const store = Taro.getStorageSync('store');
    return {
      title: `${store.name}${detail.machineName}维修单`,
      path: `/pages/repairOrderDetail/index?id=${this.$router.params.id}`,
    };
  };

  callContactPhone = () => {
    const { detail } = this.props;
    Taro.makePhoneCall({
      phoneNumber: detail.customerPhone,
    });
  };

  goToCustomer = () => {
    const { detail } = this.props;
    Taro.navigateTo({
      url: `/pages/customerDetail/index?id=${detail.customerId}`,
    });
  };

  goToMachine = () => {
    const { detail } = this.props;
    Taro.navigateTo({
      url: `/pages/machineDetail/index?id=${detail.machineId}`,
    });
  };

  goToEmployee = () => {
    const { detail } = this.props;
    Taro.navigateTo({
      url: `/pages/employeeDetail/index?id=${detail.employeeId}`,
    });
  };

  edit = () => {
    this.setState({
      isOpened: false,
    });
    Taro.navigateTo({
      url: `/pages/repairOrderEdit/index?id=${this.$router.params.id}`,
    });
  };

  showMore = () => {
    Taro.navigateTo({
      url: `/pages/repairOrderDetailMore/index?id=${this.$router.params.id}`,
    });
  };

  setItem = () => {
    Taro.navigateTo({
      url: `/pages/repairOrderDetailItem/index?id=${this.$router.params.id}`,
    });
  };

  modalOk = () => {
    const { dispatch } = this.props;
    this.modalHidden();
    dispatch({
      type: 'repairOrderDetail/delete',
      payload: this.$router.params.id,
    });
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

  payModalShow = () => {
    this.setState({
      payModalIsOpened: true,
    });
  };

  payModalHidden = () => {
    this.setState({
      payModalIsOpened: false,
    });
  };

  dataTimeSelectClose = () => {
    this.setState({
      dataTimeSelectVisible: false,
    });
  };

  dataTimeSelectOpen = () => {
    this.setState({
      dataTimeSelectVisible: true,
    });
  };

  dataTimeSelectOk = dateTimes => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairOrderDetail/setState',
      payload: {
        id: this.$router.params.id,
        params: {
          startTime: dateTimes[0],
          finishTime: dateTimes[1],
        },
      },
      callback: this.dataTimeSelectClose,
    });
  };

  render() {
    const { detail } = this.props;
    const { isOpened, modalIsOpened, payModalIsOpened, dataTimeSelectVisible } = this.state;
    const store = Taro.getStorageSync('store');

    let current = 0;
    if (detail.startTime) {
      current = 1;
      if (detail.finishTime) {
        current = 2;
      }
    }
    return (
      <PageWarp>
        <View className={styles.headCon}>
          <View className={styles.head}>
            <View className={styles.headName}>
              <Text className={styles.headNameIcon} />
              {store.name}
            </View>
            <View className={styles.headTitle}>维修单</View>
            <View className={`${styles.headInfo} at-row`}>
              <View className="at-col">{moment(detail.createdAt).format('YYYY年MM月DD日')}</View>
              <View className={`at-col ${styles.headCode}`}>{detail.code}</View>
            </View>
          </View>
        </View>
        <ScrollView
          scrollY
          style={{
            height: `${getFlexHeight([124, 50])}px`,
          }}
        >
          <View className={styles.title}>维修单信息</View>
          <View className={`${styles.con} ${styles.info}`}>
            <View className="at-row at-row--wrap">
              <View
                className={`at-col at-col-6 ${detail.customerId ? styles.active : ''}`}
                onClick={detail.customerId ? this.goToCustomer : () => {}}
              >
                <View className={styles.infoTitle}>客户</View>
                <View className={styles.infoCon}>
                  {detail.customerName || '--'} <View />
                </View>
              </View>
              <View
                className={`at-col at-col-6 ${styles.infoRight} ${
                  detail.customerPhone ? styles.active : ''
                }`}
                onClick={detail.customerPhone ? this.callContactPhone : () => {}}
              >
                <View className={styles.infoTitle}>联系电话</View>
                <View className={styles.infoCon}>
                  {detail.customerPhone || '--'} <View />
                </View>
              </View>
              <View
                className={`at-col at-col-6 ${detail.machineId ? styles.active : ''}`}
                onClick={detail.machineId ? this.goToMachine : () => {}}
              >
                <View className={styles.infoTitle}>机械</View>
                <View className={styles.infoCon}>
                  {detail.machineName || '--'} <View />
                </View>
              </View>
              <View
                className={`at-col at-col-6 ${styles.infoRight} ${
                  detail.employeeId ? styles.active : ''
                }`}
                onClick={detail.employeeId ? this.goToEmployee : () => {}}
              >
                <View className={styles.infoTitle}>技师</View>
                <View className={styles.infoCon}>
                  {detail.employeeName || '--'} <View />
                </View>
              </View>
              <View className={`at-col at-col-6 ${styles.infoEnd}`}>
                <View className={styles.infoTitle}>进场时间</View>
                <View className={styles.infoCon}>
                  {detail.enterTime ? moment(detail.enterTime).format('YYYY-MM-DD HH:mm') : '--'}{' '}
                  <View />
                </View>
              </View>
              <View className={`at-col at-col-6 ${styles.infoEnd} ${styles.infoRight}`} />
            </View>
          </View>
          <View className={styles.title}>服务项目</View>
          <View className={`${styles.con} ${styles.itemList}`}>
            {detail.repairItems.length === 0 && (
              <View className={styles.noItem}>
                <Text className={styles.noItemIcon} />
                请设置服务项目
              </View>
            )}
            {detail.repairItems.map(item => {
              return (
                <RepairOrderDetailItem
                  key={item.id}
                  name={item.name}
                  length={item.num}
                  unit={item.unit}
                  price={item.totalPrice < 0 ? 0 - item.totalPrice : item.totalPrice}
                  isPay={item.totalPrice < 0}
                />
              );
            })}
            <View className={`at-row ${styles.itemListFoot}`}>
              <View className="at-col at-col-9">合计</View>
              <View
                className={`at-col at-col-3 ${styles.itemPrice} ${
                  detail.totalPrice < 0 ? styles.red : ''
                }`}
              >
                <Text>
                  {toLocaleNumber(
                    detail.totalPrice < 0 ? 0 - detail.totalPrice : detail.totalPrice,
                    1
                  )}
                </Text>
              </View>
            </View>
          </View>
          <View className={styles.title}>维修进度</View>
          <View className={`${styles.con} ${styles.step}`}>
            <Step
              items={[
                {
                  title: '开始时间',
                  desc: detail.startTime || '暂无',
                },
                {
                  title: '完工时间',
                  desc: detail.finishTime || '暂无',
                },
              ]}
              current={current}
            />
          </View>
          <View className={`${styles.con} ${styles.line}`}>
            <View />
          </View>
          <View className={styles.tools}>
            <View className="at-row">
              <View className={`at-col ${styles.tool}`} onClick={this.showMore}>
                查看详细
              </View>
              <View className={`at-col ${styles.tool}`} onClick={this.setItem}>
                设置服务项目
              </View>
              <View className={`at-col ${styles.tool}`} onClick={this.dataTimeSelectOpen}>
                设置进度
              </View>
            </View>
          </View>
          <AtList className={styles.list} hasBorder={false}>
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
        <View className={`${styles.foot} at-row`}>
          <View className="at-col at-col-3" onClick={this.menuShow}>
            <View className={styles.more} />
            更多
          </View>
          <View className={`${styles.footEnd} at-col at-col-3`}>
            <AtButton openType="share" className={styles.shareBtn}>
              <View className={styles.share} />
              分享
            </AtButton>
          </View>
          <View className={`at-col at-col-6 ${styles.bill}`} onClick={this.payModalShow}>
            <View className="at-row">
              <View className={`at-col ${styles.total}`}>
                <View>服务项目</View>
                <View>合计 ¥{toLocaleNumber(detail.totalPrice, 1)}</View>
              </View>
              <View className="at-col">
                <View className={styles.icon} /> 结算
              </View>
            </View>
          </View>
        </View>
        <AtActionSheet
          isOpened={isOpened}
          cancelText="取消"
          title="你可以对维修单进行这些操作"
          className={styles.menu}
          onClose={this.menuHidden}
          onCancel={this.menuHidden}
        >
          {/* <AtActionSheetItem onClick={this.edit}>编辑</AtActionSheetItem> */}
          <AtActionSheetItem onClick={this.modalShow}>
            <Text style={{ color: '#DF0000' }}>作废</Text>
          </AtActionSheetItem>
        </AtActionSheet>
        <AtModal isOpened={modalIsOpened} closeOnClickOverlay={false}>
          <AtModalContent>
            <View className={styles.confirmContent}>
              <AtIcon className={styles.confirmIcon} value="help" size="22" color="#DF0000" />
              你确定要作废该维修单？
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.modalHidden}>取消</Button>
            <Button onClick={this.modalHidden}>确定</Button>
          </AtModalAction>
        </AtModal>
        <AtModal
          className={styles.confirm}
          closeOnClickOverlay={false}
          isOpened={payModalIsOpened}
          title="确认提交结算"
          cancelText="取消"
          confirmText="确认"
          onCancel={this.payModalHidden}
          onConfirm={this.payModalHidden}
          content="请确保维修单中的服务项目准确无误，结算单中不能修改服务项目。"
        />
        <DateTimeRange
          canOnlyStart
          show={dataTimeSelectVisible}
          onOk={this.dataTimeSelectOk}
          onClose={this.dataTimeSelectClose}
          value={[detail.startTime, detail.finishTime]}
          title={['请设置开始时间', '请设置完工时间']}
        />
      </PageWarp>
    );
  }
}

export default Page;
