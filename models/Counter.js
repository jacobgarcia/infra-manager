/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  inputs: [Number],
  outputs: [Number]
})

module.exports = mongoose.model('Counter', schema)
