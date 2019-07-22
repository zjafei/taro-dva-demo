/**
 * pages模版快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run comp test');
  process.exit(0);
}

if (fs.existsSync(`./src/components/${dirName}`)) {
  console.log(`${dirName} 文件夹已存在！`);
  process.exit(0);
}

// 页面模版
const indexTep = `import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './index.scss';

@connect(({${dirName}, loading}) => ({
  ${dirName},
  isLoad: loading.effects['${dirName}/load'],
}))
class CustomizeComponent extends Component {

  state = {};

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: '${dirName}/load',
    });
  };

  render() {
    const {
      ${dirName}: { test },
    } = this.props;
    return (
      <View className={styles.${dirName}Component}>
        {test}
      </View>
    );
  }
}

export default CustomizeComponent;
`;

// scss文件模版
const scssTep = `.${dirName}Component {
  color: red;
}
`;

// model文件模版
const modelTep = `import reducers from '@/utils/reducers';
import api from '@/server/api';

const namespace = '${dirName}';
const selectState = state => state[namespace];

export default {
  namespace,
  state: {
    test: namespace,
  },
  reducers,
  effects: {
    *load(_, { call, put, select }) {
      const { test } = yield select(selectState);
      const response = yield call(api.demo, { test });
      switch (response.code) {
        case 0:
          yield put({
            type: 'save',
            payload: {
              test: response.data,
            },
          });
          break;
        default:
          break;
      }
    },
  },
};
`;

// service页面模版
// const serviceTep = `import Request from '../../utils/request';

// export const demo = data => Request({
//   url: '路径',
//   method: 'POST',
//   data,
// });
// `;

fs.mkdirSync(`./src/components/${dirName}`); // mkdir $1
process.chdir(`./src/components/${dirName}`); // cd $1

fs.writeFileSync('index.jsx', indexTep);
fs.writeFileSync('index.scss', scssTep);
fs.writeFileSync('model.js', modelTep);
// fs.writeFileSync('service.js', serviceTep);

console.log(`组件 ${dirName} 已创建, 请手动增加models`);

// function titleCase(str) {
//   const array = str.toLowerCase().split(' ');
//   for (let i = 0; i < array.length; i++) {
//     array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
//   }
//   const string = array.join(' ');
//   return string;
// }

process.exit(0);
