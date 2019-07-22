import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.scss';

class CustomComponent extends Component {
  render() {
    const { className, icon, title } = this.props;
    const style = icon ? { backgroundImage: `url('${icon}')` } : {};
    return (
      <View className={`${styles.con} ${className}`}>
        <View className={styles.icon} style={style} />
        {title && <View className={styles.title}>{title}</View>}
        <View className={styles.info}>{this.props.children}</View>
      </View>
    );
  }
}

CustomComponent.defaultProps = {
  className: '',
  icon: '',
  title: '',
};

export default CustomComponent;
