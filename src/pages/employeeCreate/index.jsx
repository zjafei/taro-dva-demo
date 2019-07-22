import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import dict from '@/utils/dict';
import PageWarp from '@/components/PageWarp';
import EmployeeForm from '@/components/EmployeeForm';

@connect(({ employeeCreate }) => ({
  isLoading: employeeCreate.isLoading,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '新增人员',
    enablePullDownRefresh: false,
  };

  submit = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeCreate/create',
      payload: data,
    });
  };

  render() {
    return (
      <PageWarp>
        <EmployeeForm
          isLoading={this.props.isLoading}
          data={{
            avatar: [],
            customerType: dict.PERSONAL,
          }}
          onOk={this.submit}
        />
      </PageWarp>
    );
  }
}

export default Page;
