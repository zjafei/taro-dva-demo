import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
// import dict from '@/utils/dict';
// import regexps from '@/utils/regexps';
import Form from '@/components/Form';
import FormItem from '@/components/Form/Item';
import MachineSelect from '@/components/MachineSelect';
import EmployeeSelect from '@/components/EmployeeSelect';
import DateTimeSelect from '@/components/DateTimeSelect';

import styles from './index.scss';

class CustomComponent extends Form {
  state = {
    machineId: null,
    machineText: null,
    employeeId: null,
    employeeText: null,
    enterTime: null,

    // 验证
    validate: {
      machineId: {
        rule: () => this.state.machineId,
      },
      // employeeId: {
      //   rule: () => this.state.employeeId,
      // },
    },

    errors: [],

    selectVisible: false,
    employeeSelectVisible: false,
    enterTimeSelectVisible: false,
  };

  componentDidMount = () => {
    this.setState({
      ...this.props.data,
    });
  };

  submit = () => {
    const { onOk } = this.props;
    this.validateFields(errors => {
      this.setState({
        errors,
      });
      if (errors.length === 0) {
        onOk(this.getFieldsValue(['machineId', 'employeeId', 'enterTime']));
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
        machineId: selects[0].id,
        machineText: selects[0].name,
      });
    } else {
      this.setState({
        machineId: null,
        machineText: null,
      });
    }
    this.selectClose();
  };

  employeeSelectClose = () => {
    this.setState({
      employeeSelectVisible: false,
    });
  };

  employeeSelectOpen = () => {
    this.setState({
      employeeSelectVisible: true,
    });
  };

  employeeSelectOk = selects => {
    if (selects.length > 0) {
      this.setState({
        employeeId: selects[0].id,
        employeeText: selects[0].name,
      });
    } else {
      this.setState({
        employeeId: null,
        employeeText: null,
      });
    }
    this.employeeSelectClose();
  };

  enterTimeSelectClose = () => {
    this.setState({
      enterTimeSelectVisible: false,
    });
  };

  enterTimeSelectOpen = () => {
    this.setState({
      enterTimeSelectVisible: true,
    });
  };

  enterTimeSelectOk = enterTime => {
    this.setState({
      enterTime,
    });
    this.enterTimeSelectClose();
  };

  render() {
    const {
      errors,
      selectVisible,
      machineId,
      machineText,
      employeeSelectVisible,
      employeeId,
      employeeText,
      enterTimeSelectVisible,
      enterTime,
      machineIdDisabled,
      employeeIdDisabled,
      enterTimeDisabled,
    } = this.state;
    const selected = machineId ? [{ id: machineId, name: machineText }] : [];
    const employeeSelected = employeeId ? [{ id: employeeId, name: employeeText }] : [];
    return (
      <View>
        <MachineSelect
          show={selectVisible}
          onOk={this.selectOk}
          onClose={this.selectClose}
          selected={selected}
          title="请选择需要维修的机械"
        />
        <EmployeeSelect
          show={employeeSelectVisible}
          onOk={this.employeeSelectOk}
          onClose={this.employeeSelectClose}
          selected={employeeSelected}
          title="请选择维修技师"
        />
        <DateTimeSelect
          show={enterTimeSelectVisible}
          onOk={this.enterTimeSelectOk}
          onClose={this.enterTimeSelectClose}
          value={enterTime}
          title="请设置进场时间"
        />
        <View className={styles.form}>
          <FormItem
            title="所属机械"
            required
            info="请选择所属机械！"
            error={errors.indexOf('machineId') !== -1}
            arrow={machineIdDisabled ? '' : 'right'}
          >
            <View onClick={machineIdDisabled ? () => {} : this.selectOpen}>
              {machineText ? (
                <View style={{ color: '#333' }}>{machineText}</View>
              ) : (
                <View style={{ color: '#ccc' }}>请选择</View>
              )}
            </View>
          </FormItem>
          <FormItem
            title="维修技师"
            // required
            info="请选择维修技师！"
            error={errors.indexOf('employeeId') !== -1}
            arrow={employeeIdDisabled ? '' : 'right'}
          >
            <View onClick={employeeIdDisabled ? () => {} : this.employeeSelectOpen}>
              {employeeText ? (
                <View style={{ color: '#333' }}>{employeeText}</View>
              ) : (
                <View style={{ color: '#ccc' }}>请选择</View>
              )}
            </View>
          </FormItem>
          <FormItem
            title="进场时间"
            // required
            info="请选择进场时间！"
            error={errors.indexOf('enterTime') !== -1}
            arrow={enterTimeDisabled ? '' : 'right'}
          >
            <View onClick={enterTimeDisabled ? () => {} : this.enterTimeSelectOpen}>
              {enterTime ? (
                <View style={{ color: '#333' }}>{enterTime}</View>
              ) : (
                <View style={{ color: '#ccc' }}>请选择</View>
              )}
            </View>
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
  machineIdDisabled: false,
  employeeIdDisabled: false,
  enterTimeDisabled: false,
};

export default CustomComponent;
