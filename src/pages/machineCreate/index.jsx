import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
// import dict from '@/utils/dict';
import PageWarp from '@/components/PageWarp';
import MachineForm from '@/components/MachineForm';

@connect(({ machineCreate }) => ({
  isLoading: machineCreate.isLoading,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '新增机械',
    enablePullDownRefresh: false,
  };

  submit = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'machineCreate/create',
      payload: data,
    });
  };

  componentDidMount = () => {
    Taro.setNavigationBarTitle({
      title: this.$router.params.customerId ? '客户新增机械' : '新增机械',
    });
  };

  render() {
    const data = {
      machinePhotoList: [],
    };
    if (this.$router.params.customerId) {
      data.customerIdDisabled = true;
      data.customerId = parseInt(this.$router.params.customerId, 10);
      data.customerText = this.$router.params.customerText;
    }
    return (
      <PageWarp>
        <MachineForm isLoading={this.props.isLoading} data={data} onOk={this.submit} />
      </PageWarp>
    );
  }
}

export default Page;
