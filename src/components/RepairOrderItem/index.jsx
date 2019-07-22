import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
// import { AtTag } from 'taro-ui';
// import dict from '@/utils/dict';
import { getAssets } from '@/utils';
import styles from './index.scss';

class CustomComponent extends Component {
  render() {
    const { data, onClick } = this.props;

    return (
      <View className={styles.item} onClick={onClick}>
        <View
          className={styles.image}
          style={{
            backgroundImage: `url('${data.machineImageUrl ||
              getAssets('/assets/images/noRepairOrder.png')}')`,
          }}
        />
        <View className={styles.con}>
          <View className={styles.name}>{data.code}</View>
          <View className={styles.info}>
            <View>
              <Text>机械</Text>
              {data.machineName || '--'}
            </View>
            <View>
              <Text>客户</Text>
              {data.customerName || '--'}
            </View>
          </View>
          <View className={styles.info}>
            <View>
              <Text>技师</Text>
              {data.employeeName || '--'}
            </View>
            <View>
              <Text>进场</Text>
              {data.enterTime || '--'}
            </View>
          </View>
          <View className={styles.info}>
            <View>
              <Text>开始</Text>
              {data.startTime || '--'}
            </View>
            <View>
              <Text>完工</Text>
              {data.finishTime || '--'}
            </View>
          </View>
          {/* <View className={styles.tag}>等待维修</View> */}
        </View>
      </View>
    );
  }
}

CustomComponent.defaultProps = {
  data: {},
  onClick: () => {},
};

export default CustomComponent;
