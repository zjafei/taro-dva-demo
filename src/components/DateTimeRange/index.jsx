import Taro, { Component } from '@tarojs/taro';
import { AtDrawer } from 'taro-ui';
// import { connect } from '@tarojs/redux';
import { View, Text, Picker } from '@tarojs/components';
import moment from 'moment';
import { getFlexHeight } from '@/utils';
import FormItem from '@/components/Form/Item';
import styles from './index.scss';

// @connect(({ globalModel }) => ({
//   globalModel,
// }))
class CustomComponent extends Component {
  state = {
    startDate: null,
    startTime: null,
    startDateTemp: null,
    startTimeTemp: null,

    endDate: null,
    endTime: null,
    endDateTemp: null,
    endTimeTemp: null,
  };

  componentDidUpdate = preProps => {
    if (JSON.stringify(preProps.value) !== JSON.stringify(this.props.value)) {
      const start = moment(`${this.props.value[0]}:00`);
      const end = moment(`${this.props.value[1]}:00`);

      const startDate = start.format('YYYY-MM-DD');
      const startTime = start.format('HH:mm');

      const endDate = end.format('YYYY-MM-DD');
      const endTime = end.format('HH:mm');

      this.setState({
        startDate,
        startTime,
        startDateTemp: startDate,
        startTimeTemp: startTime,

        endDate,
        endTime,
        endDateTemp: null,
        endTimeTemp: null,
      });
    }
  };

  selectStartDate = event => {
    this.setState({
      startDate: event.detail.value,
    });
  };

  selectStartTime = event => {
    this.setState({
      startTime: event.detail.value,
    });
  };

  selectEndDate = event => {
    this.setState({
      endDate: event.detail.value,
    });
  };

  selectEndTime = event => {
    this.setState({
      endTime: event.detail.value,
    });
  };

  close = () => {
    const { onClose } = this.props;
    const { startDateTemp, startTimeTemp, endDateTemp, endTimeTemp } = this.state;
    this.setState({
      startDate: startDateTemp,
      startTime: startTimeTemp,
      endDate: endDateTemp,
      endTime: endTimeTemp,
    });
    onClose();
  };

  ok = () => {
    const { onOk, canOnlyStart } = this.props;
    const { startDate, startTime, endDate, endTime } = this.state;
    const startDateTime = startDate && startTime ? `${startDate} ${startTime}` : null;
    const endDateTime = endDate && endTime ? `${endDate} ${endTime}` : null;
    if (startDateTime === null) {
      Taro.atMessage({
        message: '请选择开始时间！',
        type: 'error',
      });
      return undefined;
    }

    if (startDateTime !== null && endDateTime === null) {
      if (canOnlyStart === true) {
        this.setState({
          startDateTemp: startDate,
          startTimeTemp: startTime,
          endDate: null,
          endTime: null,
          endDateTemp: null,
          endTimeTemp: null,
        });
        onOk([startDateTime, null]);
      } else {
        Taro.atMessage({
          message: '请选择结束时间！',
          type: 'error',
        });
      }
    }

    if (startDateTime !== null && endDateTime !== null) {
      if (moment(`${startDateTime}:00`).valueOf() > moment(`${endDateTime}:00`).valueOf()) {
        Taro.atMessage({
          message: '开始时间不能大于结束时间！',
          type: 'error',
        });
        return undefined;
      }
      this.setState({
        startDateTemp: startDate,
        startTimeTemp: startTime,
        endDateTemp: endDate,
        endTimeTemp: endTime,
      });
      onOk([startDateTime, endDateTime]);
    }
  };

  render() {
    const { show, title } = this.props;
    const { startDate, startTime, endDate, endTime } = this.state;

    return (
      <AtDrawer right show={show} width="320px" mask onClose={this.close}>
        <View className={styles.con}>
          <View
            className={styles.body}
            style={{
              height: `${getFlexHeight([48])}px`,
            }}
          >
            <View className={styles.title}>{title[0]}</View>
            <View>
              <FormItem title="开始日期" arrow="right">
                <Picker mode="date" onChange={this.selectStartDate} value={startDate}>
                  <View>
                    {startDate === null ? <Text style={{ color: '#ccc' }}>请选择</Text> : startDate}
                  </View>
                </Picker>
              </FormItem>
              <FormItem title="开始时间" arrow="right">
                <Picker mode="time" onChange={this.selectStartTime} value={startTime}>
                  <View>
                    {startTime === null ? <Text style={{ color: '#ccc' }}>请选择</Text> : startTime}
                  </View>
                </Picker>
              </FormItem>
            </View>
            <View className={styles.title}>{title[1]}</View>
            <FormItem title="结束日期" arrow="right">
              <Picker mode="date" onChange={this.selectEndDate} value={endDate}>
                <View>
                  {endDate === null ? <Text style={{ color: '#ccc' }}>请选择</Text> : endDate}
                </View>
              </Picker>
            </FormItem>
            <FormItem title="结束时间" arrow="right">
              <Picker mode="time" onChange={this.selectEndTime} value={endTime}>
                <View>
                  {endTime === null ? <Text style={{ color: '#ccc' }}>请选择</Text> : endTime}
                </View>
              </Picker>
            </FormItem>
          </View>
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
  title: ['请设置开始时间', '请设置结束时间'],
  value: [],
  canOnlyStart: false,
  onOk: () => {},
  onClose: () => {},
};

export default CustomComponent;
