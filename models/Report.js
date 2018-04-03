/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  vibration_one: Boolean,
  vibration_two: Boolean,
  door_one: Boolean,
  door_two: Boolean,
  battery: Boolean,
  camera_one: String,
  camera_two: String,
  timestamp: { type: Number, default: Date.now }
})

module.exports = mongoose.model('Report', schema)
