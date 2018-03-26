/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  id: { type: String, unique: true },
  name: String,
  room: { type: String, required: true, unique: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  site: { type: Schema.Types.ObjectId, ref: 'Site' },
  records: [String],
  photo: String
})

module.exports = mongoose.model('Stream', schema)
