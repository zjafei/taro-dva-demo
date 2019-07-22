import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
// import dict from '@/utils/dict';
import PageWarp from '@/components/PageWarp';
import RepairOrderForm from '@/components/RepairOrderForm';

@connect(({ repairOrderCreate }) => ({
  isLoading: repairOrderCreate.isLoading,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '新增维修单',
    enablePullDownRefresh: false,
  };

  submit = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairOrderCreate/create',
      payload: data,
    });
  };

  componentDidMount = () => {
    let title = '新增维修单';
    if (this.$router.params.employeeId) {
      title = '人员新增维修单';
    }
    if (this.$router.params.machineId) {
      title = '机械新增维修单';
    }
    Taro.setNavigationBarTitle({
      title,
    });
  };

  render() {
    const data = {};
    if (this.$router.params.machineId) {
      data.machineIdDisabled = true;
      data.machineId = parseInt(this.$router.params.machineId, 10);
      data.machineText = this.$router.params.machineText;
    }

    if (this.$router.params.employeeId) {
      data.employeeIdDisabled = true;
      data.employeeId = parseInt(this.$router.params.employeeId, 10);
      data.employeeText = this.$router.params.employeeText;
    }

    return (
      <PageWarp>
        <RepairOrderForm isLoading={this.props.isLoading} data={data} onOk={this.submit} />
      </PageWarp>
    );
  }
}

export default Page;
