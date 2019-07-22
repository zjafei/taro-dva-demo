import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
// import dict from '@/utils/dict';
import { AtToast } from 'taro-ui';
import PageWarp from '@/components/PageWarp';
import RepairOrderForm from '@/components/RepairOrderForm';

@connect(({ repairOrderEdit }) => ({
  isLoading: repairOrderEdit.isLoading,
  data: repairOrderEdit.data,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '编辑维修单',
    enablePullDownRefresh: false,
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairOrderEdit/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  submit = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairOrderEdit/edit',
      id: this.$router.params.id,
      payload: data,
    });
  };

  render() {
    const { isLoading, data } = this.props;
    return (
      <PageWarp>
        {isLoading === false && (
          <RepairOrderForm isLoading={this.props.isLoading} data={data} onOk={this.submit} />
        )}
        {isLoading && <AtToast hasMask isOpened text="加载中..." duration={0} status="loading" />}
      </PageWarp>
    );
  }
}

export default Page;
