/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  camera: String,
  exception: String
})

module.exports = mongoose.model('Exception', schema)
