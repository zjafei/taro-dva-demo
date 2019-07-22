import Taro from '@tarojs/taro';
import hostMap from '@/server/hostMap';

export function getAssets(url) {
  return hostMap.staticHost + url;
}

export function delay(time) {
  return new Promise(r => {
    setTimeout(r, time);
  });
}

export function getSystemInfo(name) {
  const systemInfo = Taro.getStorageSync('systemInfo');
  return name === undefined ? systemInfo : systemInfo[name];
}

export function getScaleFactor() {
  return getSystemInfo('screenWidth') / 375;
}

export function getFlexHeight(heights = []) {
  let setOff = 0;
  heights.forEach(height => {
    setOff += parseInt(height * getScaleFactor(), 10);
  });
  return getSystemInfo('windowHeight') - setOff;
}

export function clearAuth() {
  // Taro.removeStorageSync('XAuthStoreUser');
  Taro.removeStorageSync('xAuthToken');
  Taro.redirectTo({
    url: '/pages/login/index',
  });
}

export function toLocaleNumber(number = 0, fix = 2) {
  const tempNumber = parseFloat(number.toFixed(fix)).toLocaleString();

  if (tempNumber.indexOf('.') === -1) {
    const zList = [];
    for (let index = 0; index < fix; index++) {
      zList.push(0);
    }
    return `${tempNumber}.${zList.join('')}`;
  }

  const len = number.toString().split('.')[1].length;
  if (len < fix) {
    const zList = [];
    for (let index = 0; index < fix - len; index++) {
      zList.push(0);
    }
    return tempNumber + zList.join('');
  }

  return tempNumber;
}
