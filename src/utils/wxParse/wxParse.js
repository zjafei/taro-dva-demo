/**
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 *
 * github地址: https://github.com/icindy/wxParse
 *
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */

/**
 * utils函数引入
 * */
import showdown from './showdown.js';
import HtmlToJson from './html2json.js';

/**
 * 配置及公有属性
 * */
let realWindowWidth = 0;
let realWindowHeight = 0;
wx.getSystemInfo({
  success(res) {
    realWindowWidth = res.windowWidth;
    realWindowHeight = res.windowHeight;
  },
});

/**
 * 主函数入口区
 * */
function wxParse(
  bindName = 'wxParseData',
  type = 'html',
  data = '<div class="color:red;">数据不能为空</div>',
  target,
  imagePadding
) {
  const that = target;
  let transData = {}; // 存放转化后的数据
  if (type == 'html') {
    transData = HtmlToJson.html2json(data, bindName);
    // console.log(JSON.stringify(transData, ' ', ' '))
  } else if (type == 'md' || type == 'markdown') {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(data);
    transData = HtmlToJson.html2json(html, bindName);
    // console.log(JSON.stringify(transData, ' ', ' '))
  }
  transData.view = {};
  transData.view.imagePadding = 0;
  if (typeof imagePadding !== 'undefined') {
    transData.view.imagePadding = imagePadding;
  }
  const bindData = {};
  bindData[bindName] = transData;
  that.setData(bindData);
  that.bindData = bindData;
  that.wxParseImgLoad = wxParseImgLoad;
  that.wxParseImgTap = wxParseImgTap;

  // 新增
  bindData.wxParseImgLoad = wxParseImgLoad;
  bindData.wxParseImgTap = wxParseImgTap;

  return bindData;
}

// 图片点击事件
function wxParseImgTap(e, bindData) {
  const that = this;
  const nowImgUrl = e.target.dataset.src;
  const tagFrom = e.target.dataset.from;

  if (typeof tagFrom !== 'undefined' && tagFrom.length > 0) {
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: bindData[tagFrom].imageUrls, // 需要预览的图片http链接列表
    });
  }
}
/**
 * 图片视觉宽高计算函数区
 * */
function wxParseImgLoad(e) {
  const that = this;
  const tagFrom = e.target.dataset.from;
  const { idx } = e.target.dataset;
  if (typeof tagFrom !== 'undefined' && tagFrom.length > 0) {
    calMoreImageInfo(e, idx, that, tagFrom);
  }
}

// 假循环获取计算图片视觉最佳宽高
function calMoreImageInfo(e, idx, that, bindName) {
  const temData = that.data[bindName];
  if (!temData || temData.images.length == 0) {
    return;
  }
  const temImages = temData.images;
  // 因为无法获取view宽度 需要自定义padding进行计算，稍后处理
  const recal = wxAutoImageCal(e.detail.width, e.detail.height, that, bindName);
  // temImages[idx].width = recal.imageWidth;
  // temImages[idx].height = recal.imageheight;
  // temData.images = temImages;
  // var bindData = {};
  // bindData[bindName] = temData;
  // that.setData(bindData);

  const { index } = temImages[idx];
  let key = `${bindName}`;
  for (const i of index.split('.')) key += `.nodes[${i}]`;
  const keyW = `${key}.width`;
  const keyH = `${key}.height`;
  that.setData({
    [keyW]: recal.imageWidth,
    [keyH]: recal.imageheight,
  });
  // 下面的代码是github上看的
  // var index = temImages[idx].index.split('.');
  // var parentNode = index[0];
  // var childNode = index[1];
  // var key = `${bindName}`
  // var aryIndex = key.replace(/[^0-9]/ig,'');
  // if(key.indexOf('questionContents') !== -1) {
  //   key = `questionContentsArr[${aryIndex}][${parentNode}].nodes[${childNode}]`
  // } else if(key.indexOf('questionExplain') !== -1){
  //   key = `questionExplainArr[${aryIndex}][${parentNode}].nodes[${childNode}]`
  // } else if(key.indexOf('questionItems') !== -1){
  //   key = `questionArr[${aryIndex}][0].nodes[${childNode}]`
  // }
}

// 计算视觉优先的图片宽高
function wxAutoImageCal(originalWidth, originalHeight, that, bindName) {
  // 获取图片的原始长宽
  let windowWidth = 0;
  let windowHeight = 0;
  let autoWidth = 0;
  let autoHeight = 0;
  const results = {};
  const padding = that.data[bindName].view.imagePadding;
  windowWidth = realWindowWidth - 2 * padding;
  windowHeight = realWindowHeight;
  // 判断按照那种方式进行缩放
  // console.log("windowWidth" + windowWidth);
  if (originalWidth > windowWidth) {
    // 在图片width大于手机屏幕width时候
    autoWidth = windowWidth;
    // console.log("autoWidth" + autoWidth);
    autoHeight = (autoWidth * originalHeight) / originalWidth;
    // console.log("autoHeight" + autoHeight);
    results.imageWidth = autoWidth;
    results.imageheight = autoHeight;
  } else {
    // 否则展示原来的数据
    results.imageWidth = originalWidth;
    results.imageheight = originalHeight;
  }
  return results;
}

function wxParseTemArray(temArrayName, bindNameReg, total, that) {
  const array = [];
  const temData = that.data;
  let obj = null;
  for (let i = 0; i < total; i++) {
    const simArr = temData[bindNameReg + i].nodes;
    array.push(simArr);
  }

  temArrayName = temArrayName || 'wxParseTemArray';
  obj = JSON.parse(`{"${temArrayName}":""}`);
  obj[temArrayName] = array;
  that.setData(obj);
}

/**
 * 配置emojis
 *
 */

function emojisInit(reg = '', baseSrc = '/wxParse/emojis/', emojis) {
  HtmlToJson.emojisInit(reg, baseSrc, emojis);
}

module.exports = {
  wxParse,
  wxParseImgTap,
  wxParseTemArray,
  emojisInit,
};
