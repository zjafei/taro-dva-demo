import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui';
import regexps from '@/utils/regexps';
import hostMap from '@/server/hostMap';
import Form from '@/components/Form';
import FormItem from '@/components/Form/Item';
import ImageUpload from '@/components/ImageUpload';
import styles from './index.scss';

const ENV = process.env.NODE_ENV;
const BASEURL = hostMap.hostList[ENV];

class CustomComponent extends Form {
  state = {
    // 表单数据
    avatar: null,
    avatarPath: null,
    name: null,
    phone: null,

    // 验证
    validate: {
      name: {
        rule: () => this.state.name && this.state.name.trim().length > 0,
      },
      phone: {
        rule: () => this.state.phone && regexps.telPhone.test(this.state.phone),
      },
    },

    errors: [],
  };

  componentDidMount = () => {
    this.setState({
      ...this.props.data,
    });
  };

  imageUpload = files => {
    if (files.length > 0) {
      this.setState({
        avatar: files,
        avatarPath: files[0].path,
      });
    } else {
      this.setState({
        avatar: [],
        avatarPath: null,
      });
    }
  };

  changeName = value => {
    this.setState({
      name: value,
    });
  };

  changeContactPhone = value => {
    this.setState({
      phone: value,
    });
  };

  submit = () => {
    const { onOk } = this.props;
    this.validateFields(errors => {
      this.setState({
        errors,
      });
      if (errors.length === 0) {
        onOk(this.getFieldsValue(['avatarPath', 'name', 'phone']));
      }
    });
  };

  render() {
    const { errors } = this.state;
    return (
      <View>
        <View className={styles.form}>
          <FormItem title="照片">
            {this.state.avatar && (
              <ImageUpload
                value={this.state.avatar}
                onChange={this.imageUpload}
                header={{
                  'X-Auth-Token': Taro.getStorageSync('xAuthToken') || '',
                  'X-Auth-Store-User': Taro.getStorageSync('XAuthStoreUser') || '',
                }}
                name="image"
                // length={3}
                url={`${BASEURL}/image`}
              />
            )}
          </FormItem>
          <FormItem title="名称" required info="请填写名称！" error={errors.indexOf('name') !== -1}>
            <AtInput
              className="myInput"
              maxLength={30}
              placeholderStyle="color:#ccc"
              type="text"
              placeholder="请填写"
              value={this.state.name}
              onChange={this.changeName}
            />
          </FormItem>
          <FormItem
            title="联系电话"
            required
            info="请填写正确的联系电话！"
            error={errors.indexOf('phone') !== -1}
          >
            <AtInput
              className="myInput"
              placeholderStyle="color:#ccc"
              type="phone"
              placeholder="请填写"
              value={this.state.phone}
              onChange={this.changeContactPhone}
            />
          </FormItem>
        </View>
        <View className={styles.submitCon}>
          <AtButton type="primary" onClick={this.submit}>
            保 存
          </AtButton>
        </View>
      </View>
    );
  }
}

CustomComponent.defaultProps = {
  data: {},
  onOk: () => {},
  isLoading: false,
};

export default CustomComponent;
