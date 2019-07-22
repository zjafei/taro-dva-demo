import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
// import { AtTag } from 'taro-ui';
import dict from '@/utils/dict';
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
            backgroundImage: `url('${data.avatarUrl || getAssets('/assets/images/noAvatar.png')}')`,
          }}
        />
        <View className={styles.con}>
          <View className={styles.name}>{data.name}</View>
          <View className={styles.contact}>{data.contactPhone}</View>
          <View className={styles.info}>
            <View>
              <Text>机械</Text>
              {data.machineCount || '--'}
            </View>
            <View>
              <Text>维修单</Text>
              {data.repairCount || '--'}
            </View>
            <View>
              <Text>待付</Text>--
            </View>
          </View>
          {data.customerType && (
            <View className={styles.tag}>{dict.customerType[data.customerType]}</View>
          )}
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
