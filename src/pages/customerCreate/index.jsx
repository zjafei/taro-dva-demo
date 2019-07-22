import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import dict from '@/utils/dict';
import PageWarp from '@/components/PageWarp';
import CustomerForm from '@/components/CustomerForm';

@connect(({ customerCreate }) => ({
  isLoading: customerCreate.isLoading,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '新增客户',
    enablePullDownRefresh: false,
  };

  submit = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerCreate/create',
      payload: data,
    });
  };

  render() {
    return (
      <PageWarp>
        <CustomerForm
          isLoading={this.props.isLoading}
          data={{
            avatar: [],
            customerType: dict.PERSONAL,
            customerTypeText: dict.customerType[dict.PERSONAL],
          }}
          onOk={this.submit}
        />
      </PageWarp>
    );
  }
}

export default Page;
