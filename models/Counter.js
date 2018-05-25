/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  inputs: [Number],
  outputs: [Number],
  timestamp: { type: Number, default: Date.now }
})

module.exports = mongoose.model('Counter', schema)
