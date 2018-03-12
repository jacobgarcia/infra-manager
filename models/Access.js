/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  timestamp: { type: Date, default: new Date() },
  event: String,
  success: Boolean,
  risk: Number,
  zone: {
    name: String
  },
  status: String,
  site: String,
  access: String,
  pin: String,
  photo: String
})

module.exports = mongoose.model('Access', schema)
