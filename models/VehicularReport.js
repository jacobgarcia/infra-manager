/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  timestamp: { type: Date, default: new Date() },
  vehicle: String,
  zone: String,
  site: String,
  front: String,
  back: String,
  video: String,
  brand: String,
  model: String,
  color: String,
  plate: String,
  region: String,
  risk: { type: Number, default: 0 },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
})

module.exports = mongoose.model('VehicularReport', schema)
