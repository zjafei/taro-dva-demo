const path = require('path');

const config = {
  projectName: 'client',
  date: '2019-04-27',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
  },
  plugins: {
    babel: {
      sourceMap: true,
      presets: ['env'],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
      ],
    },
    typescript: {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        baseUrl: '.',
        declaration: false,
        experimentalDecorators: true,
        jsx: 'preserve',
        jsxFactory: 'Nerv.createElement',
        module: 'commonjs',
        moduleResolution: 'node',
        noImplicitAny: false,
        noUnusedLocals: true,
        outDir: './dist/',
        preserveConstEnums: true,
        removeComments: false,
        rootDir: '.',
        sourceMap: true,
        strictNullChecks: true,
        target: 'es6',
      },
      include: ['src/**/*'],
      exclude: ['node_modules'],
      compileOnSave: false,
    },
  },
  defineConstants: {},
  // copy: {
  //   patterns: [{ from: 'src/custom-tab-bar/', to: 'dist/custom-tab-bar/' }],
  //   options: {},
  // },
  weapp: {
    module: {
      postcss: {
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'global', // 转换模式，取值为 global/module，下文详细说明
            generateScopedName: '[hash:base64:5]',
          },
        },
        autoprefixer: {
          enable: true,
        },
        url: {
          enable: true,
          limit: 10240,
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    module: {
      postcss: {
        // cssModules: {
        //   enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        //   config: {
        //     namingPattern: 'global', // 转换模式，取值为 global/module，下文详细说明
        //     generateScopedName: '[hash:base64:5]',
        //   },
        // },
        autoprefixer: {
          enable: true,
        },
      },
    },
  },
};

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
