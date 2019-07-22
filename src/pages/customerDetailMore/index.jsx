import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { connect } from '@tarojs/redux';
import { getAssets } from '@/utils';
import dict from '@/utils/dict';
import PageWarp from '@/components/PageWarp';
import Item from '@/components/Form/Item';
import styles from './index.scss';

@connect(({ customerDetailMore }) => ({
  customerDetailMore,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '客户信息',
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMore/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  componentDidShow = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerDetailMore/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  edit = () => {
    Taro.navigateTo({
      url: `/pages/customerEdit/index?id=${this.$router.params.id}`,
    });
  };

  render() {
    const {
      customerDetailMore: { detail },
    } = this.props;
    return (
      <PageWarp>
        <View className={styles.card}>
          <Item hasBorder={false} title="客户照片">
            <View
              className={styles.image}
              style={{
                backgroundImage: `url('${detail.avatarUrl ||
                  getAssets('/assets/images/noAvatar.png')}')`,
              }}
            />
          </Item>
          <Item hasBorder={false} title="客户名称">
            {detail.name}
          </Item>
          <Item hasBorder={false} title="联系电话">
            {detail.contactPhone}
          </Item>
          <Item hasBorder={false} title="类型">
            {dict.customerType[detail.customerType]}
          </Item>
          <Item hasBorder={false} title="所在地">
            --
          </Item>
          <Item hasBorder={false} title="详细地址">
            --
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
