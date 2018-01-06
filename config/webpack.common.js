/* eslint-env node */
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: path.resolve('src/js/index')
  },
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.min.js'
  },
  plugins: [
    new webpack.BannerPlugin(
`
Developed and mantained by:
 _  _
| \ | |_   _ _ __ ___
|  \| | | | | '__/ _ \\
| |\  | |_| | | |  __/
|_| \_|\\__,_|_|  \\___|

Visit: nure.mx
We're hiring!
`)
],
  module: {
    loaders: [{
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

    },{
      test: /(\.css$|\.scss)/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'sass-loader' }
      ]
    }]
  }
}
