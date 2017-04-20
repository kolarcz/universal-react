import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import path from 'path';

module.exports = (ENV) => {
  const isDEV = (ENV === 'development');
  const webpackIsomorphicToolsPlugin
    = new WebpackIsomorphicToolsPlugin(require('./makeAssets')(ENV))
    .development(isDEV);

  return {
    devtool: isDEV ? 'cheap-module-eval-source-map' : false,
    entry: (isDEV ? ['webpack-hot-middleware/client', 'react-hot-loader/patch'] : [])
      .concat([
        path.resolve(__dirname, '../src/client/index.js')
      ]),
    context: path.resolve(__dirname, '..'),
    output: {
      filename: '[hash:8].js',
      chunkFilename: '[hash:8].[id].js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/'
    },
    plugins: [
      new ProgressBarPlugin({
        format: 'Build  :percent   :msg'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(ENV),
        __CLIENT__: true,
        __DEV__: isDEV
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: !isDEV,
        debug: isDEV,
        options: {
          postcss: [
            autoprefixer({
              browsers: ['last 2 versions']
            })
          ]
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        comments: isDEV
      }),
      new ExtractTextPlugin({
        filename: '[hash:8].css',
        allChunks: true
      })
    ].concat(isDEV ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ] : []).concat(
      webpackIsomorphicToolsPlugin
    ),
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        path.resolve(__dirname, '../src'),
        'node_modules'
      ]
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'react',
              ['env', { modules: false }]
            ],
            plugins: [
              ['transform-runtime', { polyfill: false, regenerator: true, helpers: false }],
              'transform-object-rest-spread',
              'transform-class-properties'
            ].concat(isDEV ? 'react-hot-loader/babel' : [])
          }
        }
      }, {
        test: /\.css$/,
        exclude: /node_modules/,
        use: isDEV
          ? ['style-loader', 'css-loader?modules&sourceMap&localIdentName=[hash:base64:6]', 'postcss-loader']
          : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [`css-loader?modules&localIdentName=[hash:base64:8]`, 'postcss-loader']
          })
      }, {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: isDEV
          ? ['style-loader', 'css-loader?modules&sourceMap&localIdentName=[hash:base64:6]', 'postcss-loader', 'sass-loader']
          : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [`css-loader?modules&localIdentName=[hash:base64:8]`, 'postcss-loader', 'sass-loader']
          })
      }, {
        test: /\.css$/,
        include: /node_modules/,
        use: isDEV
          ? ['style-loader', 'css-loader']
          : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader']
          })
      }, {
        test: /\.scss$/,
        include: /node_modules/,
        use: isDEV
          ? ['style-loader', 'css-loader', 'sass-loader']
          : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
          })
      }, {
        test: /\.(eot|ttf|woff2?)(\?.*)?$/,
        use: 'url-loader?name=[hash:8].[ext]&limit=1'
      }, {
        test: /\.(gif|jpe?g|png|svg)(\?.*)?$/,
        use: 'url-loader?name=[hash:8].[ext]&limit=10000'
      }, {
        test: /\.ico(\?.*)?$/,
        use: 'url-loader?name=[hash:8].[ext]&limit=1'
      }]
    }
  };
};
