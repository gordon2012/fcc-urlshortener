const webpack = require('webpack');
const path = require('path');

const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = env => {
  const production = !!(env && env.NODE_ENV && env.NODE_ENV === 'production');

  const plugins = [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    ...(production
      ? []
      : [
          new StartServerPlugin('server.js'),
          new webpack.HotModuleReplacementPlugin()
        ])
  ];

  const index = [
    './server/index',
    ...(production ? [] : ['webpack/hot/poll?1000'])
  ];

  return {
    entry: {
      index
    },
    mode: production ? 'production' : 'development',
    watch: !production,
    target: 'node',
    externals: [
      nodeExternals({
        whitelist: ['webpack/hot/poll?1000']
      })
    ],
    module: {
      rules: [
        {
          test: /\.js?$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins,
    output: {
      path: path.join(__dirname, '.build'),
      filename: 'server.js'
    }
  };
};
