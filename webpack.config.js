const path = require('path')
const webpack = require('webpack')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const safeParser = require('postcss-safe-parser')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pkg = require('./package.json')

const themeConfig = require(pkg.theme)
const theme = themeConfig()

let commonPlugins = []

const env = process.env.NODE_ENV || 'dev'
const isDev = env === 'dev'

module.exports = {
  mode: isDev ? 'development' : 'production',
  devServer: {
    contentBase: __dirname,
    compress: true,
    inline: true,
    hot: true,
    port: '9998',
    host: '0.0.0.0',
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    noInfo: true,
    proxy: [
      // {
      //   context: ['/hub_api'],
      //   target: 'http://192.168.10.143:8877',
      //   changeOrigin: true,
      // },
      {
        context: ['/hub_user_api'],
        target: 'http://192.168.90.54:8173',
        // target: 'http://192.168.10.145:8877',
        // target: 'http://172.18.100.219',
        changeOrigin: true,
      },
      {
        context: ['/hub_api'],
        target: 'http://192.168.90.134:8877',
        // target: 'http://192.168.10.145:8877',
        // target: 'http://172.18.100.219',
        changeOrigin: true,
      },
    ],
    quiet: true,
    overlay: true,
  },
  entry: './src/index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${pkg.version}/[name].js`,
    chunkFilename: isDev ? '[name].chunk.js' : `${pkg.version}/[name].[contenthash].js`,
    // 决定静态资源的 url 前缀, 注意包括 chunk 文件, 所以要同时把 dev 和 pro 环境都配对
    publicPath: isDev ? '/' : './',
    pathinfo: false,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/] || src\//,
          chunks: 'all',
          name: 'common',
          minSize: 0,
          minChunks: 2,
          enforce: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          cache: true,
          parallel: true,
          sourceMap: true,
        },        
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          parser: safeParser,
          discardComments: {
            removeAll: true,
          },
        },
      }),
    ],
  },
  resolve: {
    alias: {
      '@util': path.resolve('src/common/util'),
      '@common': path.resolve('src/common'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.styl$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'stylus-loader',
        ],
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          `less-loader?{"sourceMap":true, "modifyVars":${JSON.stringify(theme)}, "javascriptEnabled": true}`,
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|ico)$/,
        exclude: [path.resolve(__dirname, '/src/icon')],
        // exclude: ['/src/icon'],
        use: [{
          loader: 'url-loader',
          query: {
            name: `${pkg.version}/[name].[hash:8].[ext]`,
            limit: 1024 * 50,
          },
        }],
      },
      {
        test: /^((?!\.color).)*((?!\.color).)\.svg$/,
        include: [
          path.resolve(__dirname, '/src/icon'),
        ],
        use: [
          {loader: 'svg-sprite-loader'},
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {removeTitle: true},
                {convertColors: {shorthex: true}},
                {convertPathData: true},
                {removeComments: true},
                {removeDesc: true},
                {removeUselessDefs: true},
                {removeEmptyAttrs: true},
                {removeHiddenElems: true},
                {removeEmptyText: true},
                {removeUselessStrokeAndFill: true},
                {moveElemsAttrsToGroup: true},
                {removeStyleElement: true},
                {cleanupEnableBackground: true},
                {removeAttrs: {attrs: '(stroke|fill)'}},
              ],
            },
          },
        ],
      },
      {
        test: /\.md$/,
        use: [
          'html-loader', 'markdown-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: isDev,
      __PRO__: !isDev,
    }),
    new webpack.ProvidePlugin({
      lodash: '_',
      moment: 'moment',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['main'],
    }),
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    mobx: 'mobx',
    'mobx-react': 'mobxReact',
    _: '_',
    antd: 'antd',
    moment: 'moment',
  },
}

if (!isDev) {
  // 线上环境
  commonPlugins = [
    new CleanWebpackPlugin([path.join(__dirname, 'dist')]),
    new MiniCssExtractPlugin({
      filename: `${pkg.version}/[name].css`,
      chunkFilename: `${pkg.version}/[name].[contenthash].css`,
    }),
    /**
     * ! 一般不需要开启, 默认打包出来的 stats.json 文件会随着项目增大而变大
     *   如果发现项目中出现某些文件打包很大时, 执行 npm run build 之后执行 npm run analyzer 进行文件分析和打包优化
     */
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'disabled',
    //   generateStatsFile: true,
    // }),
  ]
  // module.exports.devtool = 'source-map'
} else {
  // 开发环境
  commonPlugins = [
    new webpack.HotModuleReplacementPlugin(),
  ]
  module.exports.devtool = 'cheap-module-eval-source-map'
}

module.exports.plugins = module.exports.plugins.concat(commonPlugins)
