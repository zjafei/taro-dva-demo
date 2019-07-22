module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {
    // ENV: '"dev"',
  },
  weapp: {},
  h5: {
    esnextModules: ['taro-ui'],
    devServer: {
      port: 3000,
    },
  },
};
