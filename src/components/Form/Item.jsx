import Taro, { Component } from '@tarojs/taro';
import { View, Text, Label } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import styles from './index.scss';

const arrowType = ['left', 'right', 'up', 'down'];

class CustomComponent extends Component {
  showInfo = () => {
    const { info, error } = this.props;
    if (error === true && info !== null) {
      Taro.atMessage({
        message: info,
        type: 'error',
      });
    }
  };

  render() {
    const { hasBorder, title, labelWidth, required, arrow, error } = this.props;

    return (
      <View
        className={`${styles.formItem} ${hasBorder === true ? '' : styles.noBorder}`}
        hoverClass={arrowType.indexOf(arrow) !== -1 ? styles.active : ''}
      >
        <View className={styles.container}>
          <Label
            className={styles.label}
            style={{
              width: `${labelWidth}rpx`,
            }}
          >
            {title}
            <Text
              className={styles.required}
              style={{ color: required === true ? '#df0000' : 'transparent' }}
            >
              *
            </Text>
          </Label>
          <View className={styles.item}>{this.props.children}</View>
          <View className={styles.error} onClick={this.showInfo}>
            {error === true && <AtIcon color="#FF4949" value="alert-circle" size="16" />}
          </View>
          {arrowType.indexOf(arrow) !== -1 && (
            <View className={styles.arrow}>
              <AtIcon color="#999" value={`chevron-${arrow}`} size="16" />
            </View>
          )}
        </View>
      </View>
    );
  }
}

CustomComponent.defaultProps = {
  title: null,
  required: false,
  error: false,
  labelWidth: 145,
  info: null,
  hasBorder: true,
};

export default CustomComponent;
