/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company' }, // Company id
  password: String,
  host: String,
  access: Number,
  name: String,
  surname: String,
  photoUrl: { type: String },
  zones: [{ type: Schema.Types.ObjectId, ref: 'Zone' }],
  services: [String],
  defaultPosition: [String],
  phone: Number
})

module.exports = mongoose.model('User', schema)
