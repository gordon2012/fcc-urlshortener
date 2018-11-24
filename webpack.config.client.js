const webpack = require('webpack');
const path = require('path');

module.exports = env => {
  const production = !!(env && env.NODE_ENV && env.NODE_ENV === 'production');

  const plugins = [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    ...(production ? [] : [new webpack.HotModuleReplacementPlugin()])
  ];

  const entry = [
    ...(production
      ? []
      : [
          'react-hot-loader/patch',
          'webpack-dev-server/client?http://localhost:3000',
          'webpack/hot/only-dev-server'
        ]),
    './client/index'
  ];

  return {
    devtool: 'inline-source-map',
    entry,
    mode: production ? 'production' : 'development',
    target: 'web',
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          include: [
            path.join(__dirname, 'client'),
            path.join(__dirname, 'common')
          ]
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins,
    devServer: {
      host: 'localhost',
      port: 3000,
      historyApiFallback: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },
    output: {
      path: path.join(__dirname, '.build/public'),
      publicPath: 'http://localhost:3000/',
      filename: 'client.js'
    }
  };
};
