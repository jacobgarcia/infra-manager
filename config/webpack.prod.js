/* eslint-env node */
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
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
  ]
})
