/* eslint-disable react/forbid-elements */
import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import WxParse from '@/utils/wxParse/wxParse';
// import '@/utils/wxParse/wxParse/WxParse.wxss';
// import './wxParse.scss';

/**
 * 需要注意的是，在项目的 config/index.js 文件中，有 copy 模板与样式的操作
 */
export default class ParseComponent extends Component {
  componentDidUpdate() {
    if (this.props.detail !== undefined) {
      WxParse.wxParse('article', 'html', this.props.detail, this.$scope, 5);
    }
  }

  render() {
    return (
      <View>
        <import src="../../utils/wxParse/wxParse.wxml" />
        <template is="wxParse" data="{{wxParseData:article.nodes}}" />
      </View>
    );
  }
}
