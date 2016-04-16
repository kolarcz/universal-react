const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpack = require('webpack');

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./assets'))
  .development(__DEV__);

module.exports = {
  devtool: __DEV__ ? 'cheap-module-eval-source-map' : null,
  entry: (__DEV__ ? ['webpack-hot-middleware/client'] : [])
    .concat([
      `${__dirname}/../src/client/index.js`
    ]),
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/../dist`,
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(__ENV__),
      __CLIENT__: true,
      __DEV__
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ].concat(__DEV__ ? [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ] : [
    new ExtractTextPlugin('style.css', { allChunks: true }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { screw_ie8: true, warnings: false } })
  ]).concat(
    webpackIsomorphicToolsPlugin
  ),
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: `babel-loader?${JSON.stringify({
        presets: ['react', 'es2015'].concat(__DEV__ ? 'react-hmre' : []),
        plugins: ['add-module-exports', 'transform-object-rest-spread']
      })}${__DEV__ ? '!eslint-loader' : ''}`,
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: __DEV__
        ? 'style-loader!css-loader'
        : ExtractTextPlugin.extract('style-loader', 'css-loader')
    }, {
      test: /\.scss$/,
      loader: __DEV__
        ? 'style-loader!css-loader!sass-loader'
        : ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
    }, {
      test: /\.(eot|ttf|woff2?)(\?.*)?$/,
      loader: 'url-loader?name=[hash:base64:6].[ext]&limit=50000'
    }, {
      test: /\.(gif|jpe?g|png|svg)(\?.*)?$/,
      loader: 'url-loader?name=[hash:base64:6].[ext]&limit=10000'
    }, {
      test: /\.ico(\?.*)?$/,
      loader: 'url-loader?name=[hash:base64:6].[ext]&limit=1'
    }]
  }
};
