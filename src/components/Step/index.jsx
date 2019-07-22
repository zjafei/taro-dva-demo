import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.scss';

class CustomComponent extends Component {
  render() {
    const { items, current } = this.props;
    return (
      <View className={styles.con}>
        <View className={styles.stepLineCon}>
          {items.map((item, index) => {
            return index < items.length - 1 ? (
              <View
                key={item}
                className={`${styles.stepLine} ${index < current ? styles.stepLineCur : ''}`}
              />
            ) : null;
          })}
        </View>
        <View className={styles.step}>
          {items.map((item, index) => {
            let state = 0;
            if (current === index + 1) {
              state = 2;
            }
            if (current > index + 1) {
              state = 1;
            }
            return (
              <View key={item.desc} className={`${styles.stepItem} ${styles[`state_${state}`]}`}>
                <View className={styles.stepTitle}>{item.title}</View>
                <View className={styles.stepIcon}>
                  <View>
                    <View />
                  </View>
                </View>
                <View className={styles.stepInfo}>{item.desc}</View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

CustomComponent.defaultProps = {
  items: [],
  current: 0,
};

export default CustomComponent;
