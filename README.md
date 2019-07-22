# 整合 taro-dva


相关框架内容请去官网

1. [taro](https://github.com/NervJS/taro)
2. [dvajs](https://github.com/dvajs/dva)


### 1. 使用 npm 或者 yarn 全局安装

```
npm install -g @tarojs/cli
// 或
yarn global add @tarojs/cli
```

### 2. 然后使用npm 或者yarn 安装依赖

```
npm install
// 或
yarn
```

### 3. 开始启动编译小程序

```
npm run dev:weapp
// 或
yarn run dev:weapp
```

### 4. 使用小程序开发工具打开项目目录

### 5. 创建新页面
```
npm run page 'pageName'
// 或
yarn run page 'pageName'
```

### 6. assets目录下的静态资源的上传
```
./deploy scp
```

### 7. Taro JSX 注意
 1. 和 React/Nerv 的不同： React 可以使用 ... 拓展操作符来传递属性，但在 Taro 中你不能这么做。例如：
 ```javascript
 const props = {firstName: 'Plus', lastName: 'Second'};
return <Greeting {...props} />;
 ```
 2. Taro 不支持使用 点表示法 和运行时指定类型来引用组件，例如 <MyComponents.DatePicker /> 这样的写法在 Taro 中是无法正确编译的。

 3. 在 Taro 中另一个不同是你不能使用 catchEvent 的方式阻止事件冒泡。你必须明确的使用 stopPropagation。

 4. 在各小程序端，使用匿名函数，尤其是在 循环中 使用匿名函数，比使用 bind 进行事件传参占用更大的内存，速度也会更慢。

5. 在 Taro 中，事件参数(props)都以 on 开头:
 ```javascript
// 错误
const element = <View bindtap={this.onTag} />;
const element2 = <Input bindfocus={this.onFocus} />;
const element3 = <CustomElement animationEnd={this.props.onAnimationEnd} />;

// 正确
const element = <View onClick={this.onTag} />;
const element2 = <Input onFocus={this.onFocus} />;
const element3 = <CustomElement onAnimationEnd={this.props.onAnimationEnd} />;
```
6. Taro 中，JSX 会编译成微信小程序模板字符串，因此你不能把 map 函数生成的模板当做一个数组来处理。当你需要这么做时，应该先处理需要循环的数组，再用处理好的数组来调用 map 函数。
```javascript
const list = this.state.list
  .filter(l => l.selected)
  .map(l => {
    return <li>{l.text}</li>
  })
```
7. 请不要对 this.props.children 进行任何操作。Taro 在小程序中实现这个功能使用的是小程序的 slot 功能，也就是说你可以把 this.props.children 理解为 slot 的语法糖，this.props.children 在 Taro 中并不是 React 的 ReactElement 对象，因此形如 this.props.children && this.props.children、this.props.children[0] 在 Taro 中都是非法的。

8. 组件的组合需要遵守 this.props.children 的所有规则。所有组合都必须用 render 开头，且遵守驼峰式命名法。组合只能传入单个 JSX 元素，不能传入其它任何类型。
```javascript
class Dialog extends Component {
  render () {
    return (
      <View className='dialog'>
        <View className='header'>
          {this.props.renderHeader}
        </View>
        <View className='body'>
          {this.props.children}
        </View>
        <View className='footer'>
          {this.props.renderFooter}
        </View>
      </View>
    )
  }
}

class App extends Component {
  render () {
    return (
      <View className='container'>
        <Dialog
          renderHeader={
            <View className='welcome-message'>Welcome!</View>
          }
          renderFooter={
            <Button className='close'>Close</Button>
          }
        >
          <View className="dialog-message">
            Thank you for using Taro.
          </View>
        </Dialog>
      </View>
    )
  }
}
```
9. Refs 引用 
```javascript
class MyComponent extends Component {

  refInput = (node) => {
    // 如果 ref 的是小程序原生组件，那只有在 didMount 生命周期之后才能通过
    // this.refs.input 访问到小程序原生组件
    if (process.env.TARO_ENV === 'weapp') {
      // 这里 this.refs.input 访问的时候通过 `wx.createSeletorQuery` 取到的小程序原生组件
    } else if (process.env.TARO_ENV === 'h5') {
      // 这里 this.refs.input 访问到的是 `@tarojs/components` 的 `Input` 组件实例
    }
  }; // `this.cat` 会变成 `Cat` 组件实例的引用

  render () {
    return <Input ref={this.refInput} />
  }
}

```
10. 跨平台开发
 * 内置环境变量 process.env.TARO_ENV
 ```javascript 
if (process.env.TARO_ENV === 'weapp') {
    require('path/to/weapp/name');
} else if (process.env.TARO_ENV === 'h5') {
    require('path/to/h5/name');
}
 ```

 * 统一接口的多端文件  
 
    假如有一个 Test 组件存在微信小程序、百度小程序和 H5 三个不同版本，那么就可以像如下组织代码
    * test.js 文件，这是 Test 组件默认的形式，编译到微信小程序、百度小程序和 H5 三端之外的端使用的版本
    * test.h5.js 文件，这是 Test 组件的 H5 版本
    * test.weapp.js 文件，这是 Test 组件的 微信小程序 版本
    * test.swan.js 文件，这是 Test 组件的 百度小程序 版本
```javascript
import Test from '../../components/test'

<Test argA={1} argA={2} />
```

统一接口的多端文件这一跨平台兼容写法有如下三个使用要点

    * 不同端的对应文件一定要统一接口，统一调用方式
    * 最好有一个平台无关的默认文件，这样在使用 ts 的时候也不会出现报错
    * 引用文件的时候，只需要写默认文件名，不用带文件后缀

11. 小程序原生作用域获取 this.$scope
```javascript
Taro.createCanvasContext(canvasId, this.$scope);
```
