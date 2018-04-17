/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  site: String,
  alert: String,
  timestamp: { type: Number, default: Date.now }
})

module.exports = mongoose.model('Alert', schema)
