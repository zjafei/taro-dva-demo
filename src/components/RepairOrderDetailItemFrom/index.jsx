import Taro from '@tarojs/taro';
import { AtDrawer, AtInput, AtInputNumber } from 'taro-ui';
import { View } from '@tarojs/components';
import { getFlexHeight } from '@/utils';
import Form from '@/components/Form';
import FormItem from '@/components/Form/Item';
import styles from './index.scss';

class CustomComponent extends Form {
  state = {
    name: null,
    unit: null, // 单位
    price: null, // 价格
    num: null, // 数量

    validate: {
      name: {
        rule: () => this.state.name && this.state.name.trim().length > 0,
      },
      unit: {
        rule: () => {
          if (this.state.unit && this.state.unit.length > 0) {
            return this.state.unit.trim().length > 0;
          }
          return true;
        },
      },
    },

    errors: [],
  };

  componentDidMount = () => {
    const { name, unit, price, num } = this.props.data;
    this.setState({
      name,
      unit, // 单位
      price, // 价格
      num, // 数量
    });
  };

  componentDidUpdate = preProps => {
    if (JSON.stringify(preProps.data) !== JSON.stringify(this.props.data)) {
      const { name, unit, price, num } = this.props.data;
      this.setState({
        name,
        unit, // 单位
        price, // 价格
        num, // 数量
      });
    }
  };

  close = () => {
    const { onClose } = this.props;
    this.setState({
      name: null,
      unit: null, // 单位
      price: null, // 价格
      num: null, // 数量
    });
    onClose();
  };

  ok = () => {
    const { onOk } = this.props;
    this.validateFields(errors => {
      this.setState({
        errors,
      });
      if (errors.length === 0) {
        onOk(
          this.getFieldsValue([
            'name',
            'unit', // 单位
            'price', // 价格
            'num', // 数量
          ])
        );
      }
    });
  };

  render() {
    const { show, title } = this.props;
    const { errors, name, unit, price, num } = this.state;
    return (
      <AtDrawer right show={show} width="320px" mask onClose={this.close}>
        <View className={styles.con}>
          <View
            className={styles.body}
            style={{
              height: `${getFlexHeight([48])}px`,
            }}
          >
            <View className={styles.title}>{title}</View>
            <View>
              <FormItem
                title="服务项目"
                required
                info="请填写服务项目！"
                error={errors.indexOf('name') !== -1}
              >
                <AtInput
                  className="myInput"
                  placeholderStyle="color:#ccc"
                  type="text"
                  maxLength={30}
                  placeholder="请填写"
                  value={name}
                  onChange={value => {
                    this.setFieldsValue({
                      name: value,
                    });
                  }}
                />
              </FormItem>
            </View>
            <View>
              <FormItem
                title="单位"
                info="请填写正确的单位！"
                error={errors.indexOf('unit') !== -1}
              >
                <AtInput
                  className="myInput"
                  placeholderStyle="color:#ccc"
                  type="text"
                  maxLength={30}
                  placeholder="请填写"
                  value={unit}
                  onChange={value => {
                    this.setFieldsValue({
                      unit: value,
                    });
                  }}
                />
              </FormItem>
              <FormItem
                title="单价"
                info="请填写正确的单价！"
                error={errors.indexOf('price') !== -1}
              >
                <AtInput
                  className="myInput"
                  placeholderStyle="color:#ccc"
                  type="text"
                  maxLength={30}
                  placeholder="请填写"
                  value={price}
                  onChange={value => {
                    if (Number.isNaN(value) === false) {
                      this.setFieldsValue({
                        price: Number(value).toFixed(1),
                      });
                    }
                  }}
                />
              </FormItem>
              <FormItem title="数量">
                <AtInputNumber
                  min={1}
                  max={9999}
                  step={1}
                  width={100}
                  value={num}
                  onChange={value => {
                    this.setFieldsValue({
                      num: value,
                    });
                  }}
                />
              </FormItem>
            </View>
          </View>
          <View className={styles.footer}>
            <View className={styles.close} onClick={this.close}>
              返回
            </View>
            <View onClick={this.ok} className={styles.ok}>
              确定
            </View>
          </View>
        </View>
      </AtDrawer>
    );
  }
}

CustomComponent.defaultProps = {
  show: false,
  title: '新增服务项目',
  data: null,
  onOk: () => {},
  onClose: () => {},
};

export default CustomComponent;
