import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { toLocaleNumber } from '@/utils';
import styles from './index.scss';

class CustomComponent extends Component {
  render() {
    const { name, length, unit, price, isPay } = this.props;
    return (
      <View className={styles.item}>
        <View className={styles.itemName}>{name}</View>
        <View className={styles.itemUnit}>{length ? `x${length}${unit}` : ''}</View>
        <View className={`${styles.itemPrice} ${isPay === true ? styles.red : ''}`}>
          <Text>{toLocaleNumber(price, 1)}</Text>
        </View>
      </View>
    );
  }
}

CustomComponent.defaultProps = {
  name: '',
  price: 0,
  isPay: false,
};

export default CustomComponent;
