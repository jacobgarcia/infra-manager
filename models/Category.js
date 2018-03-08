/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name: String,
  logo: String
})

module.exports = mongoose.model('Category', schema)
