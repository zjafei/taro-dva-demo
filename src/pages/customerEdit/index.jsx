import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { AtToast } from 'taro-ui';
import dict from '@/utils/dict';
import PageWarp from '@/components/PageWarp';
import CustomerForm from '@/components/CustomerForm';

@connect(({ customerEdit }) => ({
  isLoading: customerEdit.isLoading,
  data: customerEdit.data,
}))
class Page extends Component {
  config = {
    navigationBarTitleText: '编辑客户',
    enablePullDownRefresh: false,
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerEdit/detail',
      payload: this.$router.params.id,
      // payload: 9,
    });
  };

  submit = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerEdit/edit',
      id: this.$router.params.id,
      payload: data,
    });
  };

  render() {
    const { isLoading, data } = this.props;
    return (
      <PageWarp>
        {isLoading === false && (
          <CustomerForm
            data={{
              name: data.name,
              contactPhone: data.contactPhone,
              customerType: data.customerType,
              customerTypeText: dict.customerType[data.customerType],
              avatarPath: data.avatarPath,
              avatar:
                data.avatarPath !== null
                  ? [
                      {
                        path: data.avatarPath,
                        url: data.avatarUrl,
                      },
                    ]
                  : [],
            }}
            onOk={this.submit}
          />
        )}
        {isLoading && <AtToast hasMask isOpened text="加载中..." duration={0} status="loading" />}
      </PageWarp>
    );
  }
}

export default Page;
