import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

module.exports = (ENV) => {
  const isDEV = (ENV === 'development');
  const webpackIsomorphicToolsPlugin
    = new WebpackIsomorphicToolsPlugin(require('./makeAssets')(ENV))
    .development(isDEV);

  return {
    devtool: isDEV ? 'cheap-module-eval-source-map' : null,
    entry: (isDEV ? ['webpack-hot-middleware/client', 'react-hot-loader/patch'] : [])
      .concat([
        `${__dirname}/../src/client/index.js`
      ]),
    output: {
      filename: '[hash:8].js',
      chunkFilename: '[hash:8].[id].js',
      path: `${__dirname}/../dist`,
      publicPath: '/'
    },
    plugins: [
      new ProgressBarPlugin({
        format: 'Build :percent   :msg'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(ENV),
        __CLIENT__: true,
        __DEV__: isDEV
      }),
      new webpack.optimize.OccurenceOrderPlugin()
    ].concat(isDEV ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ] : [
      new ExtractTextPlugin('[hash:8].css', { allChunks: true }),
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
          presets: ['react', 'es2015'],
          plugins: [
            ['transform-runtime', { polyfill: false, regenerator: true }],
            'transform-object-rest-spread',
            'transform-async-to-generator'
          ].concat(isDEV ? 'react-hot-loader/babel' : [])
        })}`,
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: isDEV
          ? 'style-loader!css-loader?modules&sourceMap&localIdentName=[hash:base64:6]!postcss-loader'
          : ExtractTextPlugin.extract('style-loader', 'css-loader?modules&localIdentName=[hash:base64:6]!postcss-loader')
      }, {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: isDEV
          ? 'style-loader!css-loader?modules&sourceMap&localIdentName=[hash:base64:6]!postcss-loader!sass-loader'
          : ExtractTextPlugin.extract('style-loader', 'css-loader?modules&localIdentName=[hash:base64:6]!postcss-loader!sass-loader')
      }, {
        test: /\.css$/,
        include: /node_modules/,
        loader: isDEV
          ? 'style-loader!css-loader'
          : ExtractTextPlugin.extract('style-loader', 'css-loader')
      }, {
        test: /\.scss$/,
        include: /node_modules/,
        loader: isDEV
          ? 'style-loader!css-loader!sass-loader'
          : ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      }, {
        test: /\.(eot|ttf|woff2?)(\?.*)?$/,
        loader: 'url-loader?name=[hash:8].[ext]&limit=1'
      }, {
        test: /\.(gif|jpe?g|png|svg)(\?.*)?$/,
        loader: 'url-loader?name=[hash:8].[ext]&limit=10000'
      }, {
        test: /\.ico(\?.*)?$/,
        loader: 'url-loader?name=[hash:8].[ext]&limit=1'
      }]
    },
    postcss: [autoprefixer({ browsers: ['last 2 version'] })],
  };
};
