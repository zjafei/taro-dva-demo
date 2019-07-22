import Taro from '@tarojs/taro';
import hostMap from '@/server/hostMap';
import isMock from '@/server/mock';
import { clearAuth } from '@/utils';

const ENV = process.env.NODE_ENV;
const BASEURL = hostMap.hostList[ENV];

function delEmptyAttr(arg) {
  let rObj = {};
  if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
    const params = { ...arg };
    Object.keys(arg).forEach(key => {
      if (
        arg[key] === '' ||
        arg[key] === null ||
        arg[key] === undefined ||
        (Array.isArray(arg[key]) && arg[key].length === 0) ||
        (typeof arg[key] === 'object' && arg[key].length === undefined)
      ) {
        delete params[key];
      }
    });
    rObj = params;
  }

  return rObj;
}

function request({
  host = '',
  url,
  params,
  header,
  method = 'get',
  success = () => {},
  fail = () => {},
  complete = () => {},
}) {
  const methodStr = method.toUpperCase();
  const mock = isMock({ host, url, params, method: methodStr.toLowerCase() });
  if (ENV === 'development' && mock.isMock === true) {
    return Promise.resolve(mock.mock);
  }

  let urlStr = url;
  const tk = new Date().getTime();
  if (methodStr === 'GET') {
    params = { ...delEmptyAttr(params), _: tk };
  } else {
    urlStr += `?_=${tk}`;
  }
  let headerObj = {
    'content-type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-Auth-Token': Taro.getStorageSync('xAuthToken') || '',
    'X-Auth-Store-User': Taro.getStorageSync('XAuthStoreUser') || '',
  };
  if (header) {
    headerObj = {
      ...headerObj,
      ...header,
    };
  }
  return Taro.request({
    url: host === '' ? urlStr : `${host}${urlStr}`,
    method: methodStr,
    data: params,
    header: headerObj,
    success,
    fail: e => {
      Taro.showToast({
        title: '网络异常，请稍后重试！',
        icon: 'none',
      });
      fail(e);
    },
    complete,
  }).then(res => {
    const { statusCode, data } = res;
    if (statusCode >= 200 && statusCode < 300) {
      switch (data.code) {
        case 100: // 登录过期 需要重新登录
          clearAuth();
          break;
        case 101: // 登陆失败
          clearAuth();
          break;
        case 102: // 无权限
          clearAuth();
          break;
        default:
          break;
      }
      return data;
    } else {
      throw new Error(`网络请求错误，状态码${statusCode}`);
    }
  });
}

export default {
  demo(params) {
    return request({
      host: BASEURL,
      url: '/demo',
      method: 'post',
      params,
    });
  },

  login(code) {
    return request({
      host: BASEURL,
      url: '/passport/login',
      method: 'post',
      params: {
        code,
      },
    });
  },

  wxPhone(params) {
    return request({
      host: BASEURL,
      url: '/passport/wxInfo',
      method: 'post',
      params,
    });
  },

  storeList(params) {
    return request({
      host: BASEURL,
      url: '/store',
      params: {
        page: 1,
        size: 10,
        ...params,
      },
    });
  },

  storeSelect(userId) {
    return request({
      host: BASEURL,
      url: '/passport/login/user',
      method: 'post',
      params: {
        userId,
      },
    });
  },

  storeHome() {
    return request({
      host: BASEURL,
      url: '/store/home',
    });
  },

  customerList(params) {
    return request({
      host: BASEURL,
      url: '/customer',
      params: {
        page: 1,
        size: 10,
        ...params,
      },
    });
  },

  customerCreate(params) {
    return request({
      host: BASEURL,
      url: '/customer',
      method: 'post',
      params,
    });
  },

  customerDelete(id) {
    return request({
      host: BASEURL,
      url: `/customer/${id}/deleted`,
    });
  },

  customerEdit(id, params) {
    return request({
      host: BASEURL,
      url: `/customer/${id}`,
      method: 'post',
      params,
    });
  },

  customerDetail(id) {
    return request({
      host: BASEURL,
      url: `/customer/${id}`,
    });
  },

  customerDetailMore(id) {
    return request({
      host: BASEURL,
      url: `/customer/info/${id}`,
    });
  },

  customerSelectItemList(params) {
    return request({
      host: BASEURL,
      url: '/customer/selectItem',
      params: {
        page: 1,
        size: 10,
        ...params,
      },
    });
  },

  machineList(customerId, params) {
    return request({
      host: BASEURL,
      url: `/machine${customerId ? `/customer/${customerId}` : ''}`,
      params: {
        page: 1,
        size: 10,
        ...params,
      },
    });
  },

  machineCreate(params) {
    return request({
      host: BASEURL,
      url: '/machine',
      method: 'post',
      params,
    });
  },

  machineDelete(id) {
    return request({
      host: BASEURL,
      url: `/machine/${id}/deleted`,
    });
  },

  machineEdit(id, params) {
    return request({
      host: BASEURL,
      url: `/machine/${id}`,
      method: 'post',
      params,
    });
  },

  machineDetail(id) {
    return request({
      host: BASEURL,
      url: `/machine/${id}`,
    });
  },

  machineDetailMore(id) {
    return request({
      host: BASEURL,
      url: `/machine/info/${id}`,
    });
  },

  machineSelectItemList(params) {
    return request({
      host: BASEURL,
      url: '/machine/selectItem',
      params: {
        page: 1,
        size: 10,
        ...params,
      },
    });
  },

  employeeList(params) {
    return request({
      host: BASEURL,
      url: '/employee',
      params: {
        page: 1,
        size: 10,
        ...params,
      },
    });
  },

  employeeCreate(params) {
    return request({
      host: BASEURL,
      url: '/employee',
      method: 'post',
      params,
    });
  },

  employeeDelete(id) {
    return request({
      host: BASEURL,
      url: `/employee/${id}/deleted`,
    });
  },

  employeeEdit(id, params) {
    return request({
      host: BASEURL,
      url: `/employee/${id}`,
      method: 'post',
      params,
    });
  },

  employeeDetail(id) {
    return request({
      host: BASEURL,
      url: `/employee/${id}`,
    });
  },

  employeeDetailMore(id) {
    return request({
      host: BASEURL,
      url: `/employee/info/${id}`,
    });
  },

  employeeSelectItemList(params) {
    return request({
      host: BASEURL,
      url: '/employee/selectItem',
      params: {
        page: 1,
        size: 10,
        ...params,
      },
    });
  },

  repairOrderList(type = '', id, params) {
    return request({
      host: BASEURL,
      url: `/repairOrder${type ? `/${type}/${id}` : ''}`,
      params: {
        page: 1,
        size: 10,
        ...params,
      },
    });
  },

  repairOrderCreate(params) {
    return request({
      host: BASEURL,
      url: '/repairOrder',
      method: 'post',
      params,
    });
  },

  repairOrderDelete(id) {
    return request({
      host: BASEURL,
      url: `/repairOrder/${id}/deleted`,
    });
  },

  repairOrderEdit(id, params) {
    return request({
      host: BASEURL,
      url: `/repairOrder/${id}`,
      method: 'post',
      params,
    });
  },

  repairOrderDetail(id) {
    return request({
      host: BASEURL,
      url: `/repairOrder/${id}`,
    });
  },

  repairOrderDetailMore(id) {
    return request({
      host: BASEURL,
      url: `/repairOrder/info/${id}`,
    });
  },

  repairOrderDetailState(id, params) {
    return request({
      host: BASEURL,
      url: `/repairOrder/${id}/status`,
      method: 'post',
      params,
    });
  },

  repairOrderDetailDelItem(orderId, itemId) {
    return request({
      host: BASEURL,
      url: `/repairOrder/${orderId}/item/${itemId}/delete`,
      method: 'post',
    });
  },

  repairOrderDetailCreateItem(orderId, params) {
    return request({
      host: BASEURL,
      url: `/repairOrder/${orderId}/item`,
      method: 'post',
      params,
    });
  },
  repairOrderDetailEditItem(orderId, itemId, params) {
    return request({
      host: BASEURL,
      url: `/repairOrder/${orderId}/item/${itemId}/update`,
      method: 'post',
      params,
    });
  },
};
