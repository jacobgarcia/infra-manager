/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  privacy: Boolean,
  photo: {type:String, default: null },// Url
  pin: { type: String, unique: true, required: true },
  site: { type: String, ref: 'Site' },
  startdate: { type: Number, default: null },
  enddate: { type: Number, default: null } ,
  isLogged: { type: Boolean, default: false }
})

schema.index({ name: 'text', lastname: 'text', pin: 'text'})

module.exports = mongoose.model('FrmUser', schema)
