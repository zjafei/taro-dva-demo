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
    date: null,
    time: null,
    dateTemp: null,
    timeTemp: null,
  };

  componentDidUpdate = preProps => {
    if (JSON.stringify(preProps.value) !== JSON.stringify(this.props.value)) {
      const dateTime = moment(this.props.value);

      const date = dateTime.format('YYYY-MM-DD');
      const time = dateTime.format('HH:mm');
      this.setState({
        date,
        time,
        dateTemp: date,
        timeTemp: time,
      });
    }
  };

  selectDate = event => {
    this.setState({
      date: event.detail.value,
    });
  };

  selectTime = event => {
    this.setState({
      time: event.detail.value,
    });
  };

  close = () => {
    const { onClose } = this.props;
    const { dateTemp, timeTemp } = this.state;
    this.setState({
      date: dateTemp,
      time: timeTemp,
    });

    onClose();
  };

  ok = () => {
    const { onOk } = this.props;
    const { date, time } = this.state;
    const dateTime = date && time ? `${date} ${time}` : null;
    if (dateTime === null) {
      this.setState({
        date: null,
        time: null,
        dateTemp: null,
        timeTemp: null,
      });
    } else {
      this.setState({
        dateTemp: date,
        timeTemp: time,
      });
    }

    onOk(dateTime);
  };

  render() {
    const { show, title } = this.props;
    const { date, time } = this.state;

    return (
      <AtDrawer right show={show} width="320px" mask onClose={this.close}>
        <View className={styles.con}>
          <View className={styles.title}>{title}</View>
          <View
            className={styles.body}
            style={{
              height: `${getFlexHeight([44, 48])}px`,
            }}
          >
            <FormItem title="日期选择" arrow="right">
              <Picker mode="date" onChange={this.selectDate} value={date}>
                <View>{date === null ? <Text style={{ color: '#ccc' }}>请选择</Text> : date}</View>
              </Picker>
            </FormItem>
            <FormItem title="时间选择" arrow="right">
              <Picker mode="time" onChange={this.selectTime} value={time}>
                <View>{time === null ? <Text style={{ color: '#ccc' }}>请选择</Text> : time}</View>
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
  title: '请设置日期时间',
  value: null,
  onOk: () => {},
  onClose: () => {},
};

export default CustomComponent;
