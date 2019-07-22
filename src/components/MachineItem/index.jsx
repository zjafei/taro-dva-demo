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
            backgroundImage: `url('${data.machinePhotoUrl ||
              getAssets('/assets/images/noMachine.png')}')`,
          }}
        />
        <View className={styles.con}>
          <View className={styles.name}>{data.name}</View>
          <View className={styles.contact}>{data.customerName || '暂无客户'}</View>
          <View className={styles.info}>
            <View>
              {data.brand || '无品牌'} / {data.machineModel || '无类型'}
            </View>
            <View>
              <Text>最近维修：</Text> 暂无数据
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
