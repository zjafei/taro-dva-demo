import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui';
// import dict from '@/utils/dict';
// import regexps from '@/utils/regexps';
import hostMap from '@/server/hostMap';
import Form from '@/components/Form';
import FormItem from '@/components/Form/Item';
import ImageUpload from '@/components/ImageUpload';
import CustomerSelect from '@/components/CustomerSelect';
import styles from './index.scss';

const ENV = process.env.NODE_ENV;
const BASEURL = hostMap.hostList[ENV];

class CustomComponent extends Form {
  state = {
    customerId: null,
    customerText: null,

    machinePhotoList: null,
    machinePhoto: null,

    name: null,
    brand: null,
    machineModel: null,
    nameplateNumber: null,

    // 验证
    validate: {
      customerId: {
        rule: () => this.state.customerId,
      },
      name: {
        rule: () => this.state.name && this.state.name.trim().length > 0,
      },
      brand: {
        rule: () => {
          if (this.state.brand && this.state.brand.length > 0) {
            return this.state.brand.trim().length > 0;
          }
          return true;
        },
      },
      machineModel: {
        rule: () => {
          if (this.state.machineModel && this.state.machineModel.length > 0) {
            return this.state.machineModel.trim().length > 0;
          }
          return true;
        },
      },
      nameplateNumber: {
        rule: () => {
          if (this.state.nameplateNumber && this.state.nameplateNumber.length > 0) {
            return this.state.nameplateNumber.trim().length > 0;
          }
          return true;
        },
      },
    },

    errors: [],

    selectVisible: false,
  };

  componentDidMount = () => {
    this.setState({
      ...this.props.data,
    });
  };

  imageUpload = files => {
    if (files.length > 0) {
      this.setState({
        machinePhotoList: files,
        machinePhoto: files[0].path,
      });
    } else {
      this.setState({
        machinePhotoList: [],
        machinePhoto: null,
      });
    }
  };

  submit = () => {
    const { onOk } = this.props;
    this.validateFields(errors => {
      this.setState({
        errors,
      });
      if (errors.length === 0) {
        onOk(
          this.getFieldsValue([
            'customerId',
            'machinePhoto',
            'name',
            'brand',
            'machineModel',
            'nameplateNumber',
          ])
        );
      }
    });
  };

  selectClose = () => {
    this.setState({
      selectVisible: false,
    });
  };

  selectOpen = () => {
    this.setState({
      selectVisible: true,
    });
  };

  selectOk = selects => {
    if (selects.length > 0) {
      this.setState({
        customerId: selects[0].id,
        customerText: selects[0].name,
      });
    } else {
      this.setState({
        customerId: null,
        customerText: null,
      });
    }
    this.selectClose();
  };

  render() {
    const { errors, selectVisible, customerId, customerText, customerIdDisabled } = this.state;
    const selected = customerId ? [{ id: customerId, name: customerText }] : [];
    return (
      <View>
        <CustomerSelect
          show={selectVisible}
          onOk={this.selectOk}
          onClose={this.selectClose}
          selected={selected}
          title="请选择机械所属客户"
        />
        <View className={styles.form}>
          <FormItem
            title="所属客户"
            required
            info="请选择所属客户！"
            error={errors.indexOf('customerId') !== -1}
            arrow={customerIdDisabled ? '' : 'right'}
          >
            <View onClick={customerIdDisabled ? () => {} : this.selectOpen}>
              {this.state.customerText ? (
                <View style={{ color: '#333' }}>{this.state.customerText}</View>
              ) : (
                <View style={{ color: '#ccc' }}>请选择</View>
              )}
            </View>
          </FormItem>
        </View>

        <View className={styles.form}>
          <FormItem title="机械照片">
            {this.state.machinePhotoList && (
              <ImageUpload
                value={this.state.machinePhotoList}
                onChange={this.imageUpload}
                header={{
                  'X-Auth-Token': Taro.getStorageSync('xAuthToken') || '',
                  'X-Auth-Store-User': Taro.getStorageSync('XAuthStoreUser') || '',
                }}
                name="image"
                url={`${BASEURL}/image`}
              />
            )}
          </FormItem>
          <FormItem
            title="机械名称"
            required
            info="请填写机械名称！"
            error={errors.indexOf('name') !== -1}
          >
            <AtInput
              className="myInput"
              placeholderStyle="color:#ccc"
              type="text"
              maxLength={30}
              placeholder="请填写"
              value={this.state.name}
              onChange={value => {
                this.setFieldsValue({
                  name: value,
                });
              }}
            />
          </FormItem>
        </View>

        <View className={styles.form}>
          <FormItem title="品牌" info="请填写正确的品牌！" error={errors.indexOf('brand') !== -1}>
            <AtInput
              className="myInput"
              placeholderStyle="color:#ccc"
              placeholder="请填写"
              value={this.state.brand}
              onChange={value => {
                this.setFieldsValue({
                  brand: value,
                });
              }}
            />
          </FormItem>
          <FormItem
            title="型号"
            info="请填写正确的型号！"
            error={errors.indexOf('machineModel') !== -1}
          >
            <AtInput
              className="myInput"
              placeholderStyle="color:#ccc"
              placeholder="请填写"
              value={this.state.machineModel}
              onChange={value => {
                this.setFieldsValue({
                  machineModel: value,
                });
              }}
            />
          </FormItem>
          <FormItem
            title="铭牌编号"
            info="请填写正确的铭牌编号！"
            error={errors.indexOf('nameplateNumber') !== -1}
          >
            <AtInput
              className="myInput"
              placeholderStyle="color:#ccc"
              placeholder="请填写"
              value={this.state.nameplateNumber}
              onChange={value => {
                this.setFieldsValue({
                  nameplateNumber: value,
                });
              }}
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
  customerIdDisabled: false,
};

export default CustomComponent;
