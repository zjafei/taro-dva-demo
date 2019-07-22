import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { connect } from '@tarojs/redux';
import { getAssets } from '@/utils';
import PageWarp from '@/components/PageWarp';
import Item from '@/components/Form/Item';
import styles from './index.scss';

@connect(({ machineDetailMore }) => ({
  machineDetailMore,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '客户信息',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'machineDetailMore/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  componentDidShow = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'machineDetailMore/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  edit = () => {
    Taro.navigateTo({
      url: `/pages/machineEdit/index?id=${this.$router.params.id}`,
    });
  };

  render() {
    const {
      machineDetailMore: { detail },
    } = this.props;
    return (
      <PageWarp>
        <View className={styles.card}>
          <Item hasBorder={false} title="机械照片">
            <View
              className={styles.image}
              style={{
                backgroundImage: `url('${detail.machinePhotoUrl ||
                  getAssets('/assets/images/noMachine.png')}')`,
              }}
            />
          </Item>
          <Item hasBorder={false} title="客户名称">
            {detail.customerName}
          </Item>
          <Item hasBorder={false} title="机械名称">
            {detail.name}
          </Item>
          <Item hasBorder={false} title="品牌">
            {detail.brand || '--'}
          </Item>
          <Item hasBorder={false} title="型号">
            {detail.machineModel || '--'}
          </Item>
          <Item hasBorder={false} title="铭牌编号">
            {detail.nameplateNumber || '--'}
          </Item>
        </View>
        <View className={styles.card}>
          <Item hasBorder={false} title="创建人">
            {detail.createBy || '--'}
          </Item>
          <Item hasBorder={false} title="创建时间">
            {detail.createdAt}
          </Item>
          <Item hasBorder={false} title="修改人">
            {detail.updateBy || '--'}
          </Item>
          <Item hasBorder={false} title="修改时间">
            {detail.updatedAt || '--'}
          </Item>
        </View>
        <AtButton type="primary" onClick={this.edit} className={styles.editBtn}>
          编辑
        </AtButton>
      </PageWarp>
    );
  }
}

export default Page;
