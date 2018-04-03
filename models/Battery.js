/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  camera: String,
  battery: String,
  timestamp: { type: Number, default: Date.now }
})

module.exports = mongoose.model('Battery', schema)
