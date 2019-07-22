import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.scss';

class CustomComponent extends Component {
  render() {
    const { className, visible } = this.props;
    return visible === true ? (
      <View className={`${styles.con} ${className}`}>没有更多了...</View>
    ) : null;
  }
}

CustomComponent.defaultProps = {
  className: '',
  visible: false,
};

export default CustomComponent;
