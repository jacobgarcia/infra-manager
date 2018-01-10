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
  photo: String,
  // TODO add this
  zones: [{ type: Schema.Types.ObjectId, ref: 'Zone' }]
})

schema.virtual('fullName').get(function() {
  return this.name + ' ' + this.surname
})

module.exports = mongoose.model('User', schema)
