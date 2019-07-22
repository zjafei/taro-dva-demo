import Taro, { Component } from '@tarojs/taro';

class CustomComponent extends Component {
  getFieldValue = fieldName => {
    return this.state[fieldName];
  };

  getFieldsValue = fieldNames => {
    const values = {};
    fieldNames.forEach(item => {
      values[item] = this.getFieldValue(item);
    });
    return values;
  };

  setFieldsValue = value => {
    this.setState({
      ...value,
    });
  };

  validateFields = (callback = () => {}) => {
    const { validate } = this.state;
    const errors = [];
    Object.keys(validate).forEach(field => {
      validate[field].error = !validate[field].rule();
      if (validate[field].error === true) {
        errors.push(field);
      }
    });
    callback(errors);
  };

  render() {
    return null;
  }
}

export default CustomComponent;
