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
            backgroundImage: `url('${data.avatarUrl || getAssets('/assets/images/noAvatar.png')}')`,
          }}
        />
        <View className={styles.con}>
          <View className={styles.name}>{data.name}</View>
          <View className={styles.contact}>{data.phone || '--'}</View>
          <View className={styles.info}>
            <View>
              <Text>维修单：</Text> {data.repairCount || '--'}
            </View>
            <View>
              <Text>结算单：</Text> --
            </View>
          </View>
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
