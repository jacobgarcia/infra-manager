/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  id: String,
  core: { type: String, unique: true },
  user: String,
  pass: String,
  streamid: String,
  name: String,
  version: String,
  country: String,
  zone: String,
  room: { type: String },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  site: { type: Schema.Types.ObjectId, ref: 'Site' },
  photo: String,
  issuerkey: String,
})

module.exports = mongoose.model('Stream', schema)
