/* eslint-env node */
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const common = require('./webpack.common.js')
const webpack = require('webpack')
const env = process.env.NODE_ENV
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = merge(common, {
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.min.css'
    }),
    new UglifyJSPlugin({
      unused: true,
      dead_code: true, // big one--strip code that will never execute
      warnings: false, // good for prod apps so users can't peek behind curtain
      drop_debugger: true,
      conditionals: true,
      evaluate: true,
      drop_console: true, // strips console statements
      sequences: true,
      booleans: true,
    }),
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
