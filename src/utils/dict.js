const dict = {};

dict.SUCCESS = 0;
dict.UNAUTHORIZED = 100; // 登录过期 需要重新登录
dict.LOGIN_FAILED = 101; // 登录失败
dict.ACCESS_DENIED = 102; // 无权限
dict.SYSTEM_NOT_INIT = 103; // 系统问题
dict.NOT_FOUND = 200; // 未发现数据
dict.DATA_INVALID = 300; // 数据错误
dict.VALIDATION_ERROR = 301; // 数据验证错误
dict.DUPLICATE_KEY = 302; // 数据已存在
dict.WX_DECODE_FAILED = 303; // 微信解密失败

dict.responseCode = {
  [dict.SUCCESS]: 'cg',
  [dict.UNAUTHORIZED]: '登录过期 需要重新登录',
  [dict.LOGIN_FAILED]: '登录失败',
  [dict.ACCESS_DENIED]: '无权限',
  [dict.SYSTEM_NOT_INIT]: '系统问题',
  [dict.NOT_FOUND]: '未发现数据',
  [dict.DATA_INVALID]: '数据错误',
  [dict.VALIDATION_ERROR]: '数据验证错误',
  [dict.DUPLICATE_KEY]: '数据已存在',
  [dict.WX_DECODE_FAILED]: '微信解密失败',
};

dict.ROLE_PASSPORT = 'ROLE_PASSPORT';
dict.authorities = {
  [dict.ROLE_PASSPORT]: '会员',
};

dict.OTHER = 'OTHER';
dict.PERSONAL = 'PERSONAL';
dict.COMPANY = 'COMPANY';
dict.customerType = {
  [dict.PERSONAL]: '个人',
  [dict.COMPANY]: '企业',
  [dict.OTHER]: '其他',
};
export default dict;
