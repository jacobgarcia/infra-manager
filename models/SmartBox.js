/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  id: String,
  version: Number
})

module.exports = mongoose.model('SmartBox', schema)
