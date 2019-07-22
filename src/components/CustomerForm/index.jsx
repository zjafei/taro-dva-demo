import Taro from '@tarojs/taro';
import { Picker, View, Text } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui';
import dict from '@/utils/dict';
import regexps from '@/utils/regexps';
import hostMap from '@/server/hostMap';
import Form from '@/components/Form';
import FormItem from '@/components/Form/Item';
import ImageUpload from '@/components/ImageUpload';
import styles from './index.scss';

const ENV = process.env.NODE_ENV;
const BASEURL = hostMap.hostList[ENV];
const typeList = Object.keys(dict.customerType);
const typeSelect = typeList.map(key => {
  return {
    name: dict.customerType[key],
    code: key,
  };
});

class CustomComponent extends Form {
  state = {
    // 表单数据
    avatar: null,
    avatarPath: null,
    name: null,
    contactPhone: null,
    customerType: null,
    customerTypeText: '',

    // 验证
    validate: {
      name: {
        rule: () => this.state.name && this.state.name.trim().length > 0,
      },
      contactPhone: {
        rule: () => this.state.contactPhone && regexps.telPhone.test(this.state.contactPhone),
      },
    },

    errors: [],
  };

  componentDidMount = () => {
    this.setState({
      ...this.props.data,
    });
  };

  selectType = e => {
    this.setState({
      customerType: typeSelect[e.detail.value].code,
      customerTypeText: typeSelect[e.detail.value].name,
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
      contactPhone: value,
    });
  };

  submit = () => {
    const { onOk } = this.props;
    this.validateFields(errors => {
      this.setState({
        errors,
      });
      if (errors.length === 0) {
        onOk(this.getFieldsValue(['avatarPath', 'name', 'contactPhone', 'customerType']));
      }
    });
  };

  render() {
    const { errors } = this.state;
    return (
      <View>
        <View className={styles.form}>
          <FormItem title="客户照片">
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
          <FormItem
            title="客户名称"
            required
            info="请填写客户名称！"
            error={errors.indexOf('name') !== -1}
          >
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
            error={errors.indexOf('contactPhone') !== -1}
          >
            <AtInput
              className="myInput"
              placeholderStyle="color:#ccc"
              type="phone"
              placeholder="请填写"
              value={this.state.contactPhone}
              onChange={this.changeContactPhone}
            />
          </FormItem>
          <FormItem title="类型" arrow="right">
            <Picker
              mode="selector"
              range-key="name"
              // value={this.state.customerType === null ? 0 : typeList.indexOf(this.state.customerType)}
              range={typeSelect}
              onChange={this.selectType}
            >
              <View className={styles.pickerLabel}>
                {this.state.customerType === null ? (
                  <Text style={{ color: '#ccc' }}>请选择</Text>
                ) : (
                  this.state.customerTypeText
                )}
              </View>
            </Picker>
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
