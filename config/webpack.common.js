/* eslint-env node */
const path = require('path')
const env = process.env.NODE_ENV
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    app: path.resolve('src/js/index')
  },
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.min.js',
    chunkFilename: 'chunk-[id].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve('src'),
        options: {
          presets: [
            ['env', { modules: false }],
            'react',
            'stage-2'
          ],
          plugins: [
            'react-hot-loader/babel'
          ]
        }
      },
      {
        test: /\.bundle\.js$/,
        loader: 'bundle-loader',
        options: {
          name: 'my-chunk'
        }
      },
      {
        test: /(\.css$|\.scss)/,
        use: env === 'production'
          ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [{loader: 'css-loader', options: { minimize: true}},{ loader: 'sass-loader' }]
          })
          : [{ loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }]
      }
    ]
  }
}
