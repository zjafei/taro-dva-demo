import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { AtToast } from 'taro-ui';
import PageWarp from '@/components/PageWarp';
import MachineForm from '@/components/MachineForm';

@connect(({ machineEdit }) => ({
  isLoading: machineEdit.isLoading,
  data: machineEdit.data,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '编辑机械',
    enablePullDownRefresh: false,
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'machineEdit/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  submit = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'machineEdit/edit',
      id: this.$router.params.id,
      payload: data,
    });
  };

  render() {
    const { isLoading, data } = this.props;
    return (
      <PageWarp>
        {isLoading === false && <MachineForm data={data} onOk={this.submit} />}
        {isLoading && <AtToast hasMask isOpened text="加载中..." duration={0} status="loading" />}
      </PageWarp>
    );
  }
}

export default Page;
