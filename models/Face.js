/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  camera: String,
  status: Boolean,
  photo: String,
  timestamp: { type: Number, default: Date.now }
})

module.exports = mongoose.model('Face', schema)
