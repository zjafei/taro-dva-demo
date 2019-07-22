import pathToRegexp from 'path-to-regexp';
import mockJs from 'mockjs';
import hostMap from '@/server/hostMap';

const body = {
  code: 0, // 状态码
  msg: '成功', // 消息 字符串 可以为空
  content: {
    // 返回结果 result 必须为对象
  },
};

const baseField = {
  createdAt: '@DATE(yyyy-MM-dd HH:mm:ss)',
  updatedAt: '@DATE(yyyy-MM-dd HH:mm:ss)',
};

const store = {
  'userId|+1': 1,
  storeId: '@INTEGER(100,999)',
  iconUrl: 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture',
  name: '@CTITLE(2, 10)',
  machineCount: '@INTEGER(1,9)',
  customerCount: '@INTEGER(1,9)',
};

const passport = {
  ...baseField,
  'id|+1': 1,
  version: '@INTEGER(1,9)',
  nickName: '@CNAME(2,8)',
  phone: null,
};

const customerSim = {
  ...baseField,
  'id|+1': 1,
  version: '@INTEGER(1,9)',
  avatarUrl: 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture',
  name: '@CNAME(2,10)',
  contactPhone: '13888888888',
  code: 'AA0@INTEGER(1000000,9999999)',
  machineCount: '@INTEGER(1,9)',
};

const customer = {
  id: '@INTEGER(1,9999)',
  version: 0,
  ...baseField,
  avatarUrl: 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture',
  avatarPath: 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture',
  name: '@CNAME(2,10)',
  contactPhone: '13888888888',
  code: 'AA0@INTEGER(1000000,9999999)',
  machineCount: '@INTEGER(1,9)',
};

const repairItem = {
  id: '@INTEGER(1,9999)',
  version: 1,
  ...baseField,
  state: '@PICK(ENABLE,DISABLE)',
  name: '@CTITLE(2,20)',
  unit: '@CTITLE(1,2)',
  price: '@FLOAT(-99999,1, 2,2)',
  num: '@INTEGER(1,99)',
  totalPrice: '@FLOAT(-99999, 99999, 2,2)',
};

const repairOrder = {
  id: '@INTEGER(1,9)',
  version: 0,
  ...baseField,
  code: '维修单AA01000001',
  customerName: '@CNAME(2,10)',
  customerId: '@INTEGER(1,9)',
  contactPhone: '13888888888',
  machineName: '@CNAME(2,10)',
  machineId: '@INTEGER(1,9)',
  machineImageUrl: 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture',
  employeeName: '@CNAME(2,10)',
  employeeId: '@INTEGER(1,9)',
  startTime: '@DATE(yyyy-MM-dd HH:mm)',
  finishTime: '@DATE(yyyy-MM-dd HH:mm)',
  enterTime: '@DATE(yyyy-MM-dd HH:mm)',
  createBy: '@CNAME(2,10)',
  updateBy: '@CNAME(2,10)',
  totalPrice: '@FLOAT(-99999, 10, 2,2)',
  'repairItems|1-20': [repairItem],
};

const employee = {
  id: '@INTEGER(1,9)',
  version: 0,
  ...baseField,
  name: '@CNAME(2,10)',
  avatarUrl: 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture',
  avatarPath: 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture',
  phone: '13888888888',
  code: 'AA0@INTEGER(1000000,9999999)',
  createBy: '@CNAME(2,10)',
  updateBy: '@CNAME(2,10)',
};

const mockRouterMap = {
  [hostMap.hostList.development]: [
    {
      isMock: true,
      method: 'post',
      router: '/demo',
      result(params) {
        return {
          ...body,
          content: `this is ${params.test} mock data!`,
        };
      },
    },
    {
      isMock: true,
      method: 'get',
      router: '/passport/login/user',
      result() {
        return {
          ...body,
        };
      },
    },
    {
      isMock: true,
      method: 'post',
      router: '/passport/login',
      result() {
        // const phone = mockJs.Random.pick([null, 13888888888]);
        // const userId = mockJs.Random.integer(10000000, 99999999);
        return {
          ...body,
          content: {
            userId: null,
            passport: {
              ...passport,
              phone: 138888888,
            },
            'X-Auth-Token': '@INTEGER(10000000,99999999)',
            authorities: [
              {
                authority: 'ROLE_PASSPORT',
              },
            ],
          },
        };
      },
    },
    {
      isMock: true,
      method: 'get',
      router: '/store/home',
      result() {
        return {
          ...body,
          content: {
            ...store,
          },
        };
      },
    },
    {
      isMock: true,
      method: 'get',
      router: '/customer',
      result() {
        const customerType = mockJs.Random.pick(['PERSONAL', 'COMPANY']);
        return {
          ...body,
          content: {
            totalItemCount: 30,
            'data|1-10': [
              {
                customerType,
                ...customerSim,
              },
            ],
          },
        };
      },
    },
    {
      isMock: true,
      method: 'post',
      router: '/customer',
      result() {
        return {
          ...body,
        };
      },
    },
    {
      isMock: true,
      method: 'get',
      router: '/customer/:id',
      result() {
        const customerType = mockJs.Random.pick(['PERSONAL', 'COMPANY']);
        return {
          ...body,
          content: {
            customerType,
            ...customer,
          },
        };
      },
    },
    {
      isMock: true,
      method: 'get',
      router: '/store',
      result() {
        return {
          ...body,
          content: {
            totalItemCount: 30,
            'data|0-10': [store],
          },
        };
      },
    },

    {
      isMock: true,
      method: 'get',
      router: '/employee',
      result() {
        return {
          ...body,
          content: {
            totalItemCount: 30,
            'data|1-10': [employee],
          },
        };
      },
    },

    {
      isMock: true,
      method: 'get',
      router: '/employee/selectItem',
      result() {
        return {
          ...body,
          content: {
            totalItemCount: 30,
            'data|1-10': [employee],
          },
        };
      },
    },

    {
      isMock: true,
      method: 'post',
      router: '/employee',
      result() {
        return {
          ...body,
        };
      },
    },
    {
      isMock: true,
      method: 'get',
      router: '/employee/:id',
      result() {
        return {
          ...body,
          content: {
            ...employee,
          },
        };
      },
    },
    {
      isMock: true,
      method: 'get',
      router: '/employee/info/:id',
      result() {
        return {
          ...body,
          content: {
            ...employee,
          },
        };
      },
    },

    {
      isMock: true,
      method: 'get',
      router: '/repairOrder',
      result() {
        return {
          ...body,
          content: {
            totalItemCount: 30,
            'data|1-10': [repairOrder],
          },
        };
      },
    },
    {
      isMock: true,
      method: 'post',
      router: '/repairOrder',
      result() {
        return {
          ...body,
        };
      },
    },
    {
      isMock: true,
      method: 'get',
      router: '/repairOrder/:id',
      result() {
        return {
          ...body,
          content: {
            ...repairOrder,
          },
        };
      },
    },
    {
      isMock: true,
      method: 'get',
      router: '/repairOrder/info/:id',
      result() {
        return {
          ...body,
          content: {
            ...repairOrder,
          },
        };
      },
    },
    {
      isMock: true,
      method: 'post',
      router: '/repairOrder/:id/status',
      result() {
        return {
          ...body,
        };
      },
    },
    {
      isMock: true,
      method: 'post',
      router: '/repairOrder/:orderId/item/:itemId/delete',
      result() {
        return {
          ...body,
        };
      },
    },
    {
      isMock: true,
      method: 'post',
      router: '/repairOrder/:orderId/item',
      result() {
        return {
          ...body,
        };
      },
    },
    {
      isMock: true,
      method: 'post',
      router: '/repairOrder/:orderId/item/:itemId/update',
      result() {
        return {
          ...body,
        };
      },
    },
  ],
};

// host, version, url, params, methodStr
const isMock = ({ url, method, params = {}, host = '', version = '' }) => {
  let hasMock = {
    isMock: false,
  };
  const path = version !== '' ? `/${version}url` : url;
  const matchList = [];
  if (mockRouterMap[host] !== undefined) {
    for (let i = 0; i < mockRouterMap[host].length; i++) {
      const routerObject = mockRouterMap[host][i];
      if (routerObject.method.toLowerCase() === method.toLowerCase()) {
        const match = pathToRegexp(routerObject.router).exec(path);
        if (match !== null) {
          if (match.length === 1) {
            // 精确匹配
            hasMock = { ...routerObject };
            hasMock.mock = mockJs.mock(routerObject.result(params));
            break;
          } else if (routerObject.isMock === true) {
            // 动态路由
            const hasMockTemp = { ...routerObject };
            hasMockTemp.mock = mockJs.mock(routerObject.result(params));
            matchList.push(hasMockTemp);
          }
        }
      }
    }
  }

  if (hasMock.method === undefined && matchList.length > 0) {
    return matchList[0];
  }
  return hasMock;
};

export default isMock;
