/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  timestamp: { type: Date, default: new Date() },
  event: String,
  zone: { type: Schema.Types.ObjectId, ref: 'Zone' },
  site: String, // Hardcoded site
  risk: Number,
  status: String,
  access: String,
  id: String,
  match: String,
  authorized: String,
  photo: String
})

module.exports = mongoose.model('FaceRecognition', schema)
