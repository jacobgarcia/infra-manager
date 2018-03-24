/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  room: { type: String, required: true, unique: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  site: { type: Schema.Types.ObjectId, ref: 'Site' },
  camera: String,
  records: [String]
})

module.exports = mongoose.model('Stream', schema)
