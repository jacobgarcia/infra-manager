/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  id: { type: String, required: true, unique: true },
  version: Number,
  exceptions: [{
    timestamp: { type: Date, default: Date.now },
    description: String
  }],
  debugs: [{
    timestamp: { type: Date, default: Date.now },
    photos: [String],
    logFile: String
  }]
})

module.exports = mongoose.model('SmartBox', schema)
