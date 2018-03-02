/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name: String,
  model: String,
  brand: String,
  type: String,
  status: String,
  version: String,
  makerId: String,
  detailedStatus: String,
  lastMantainanceFrom: { type: Date, defualt: new Date() },
  lastMantainanceTo: { type: Date, defualt: new Date() },
  nextMantainanceFrom: { type: Date, defualt: new Date() },
  nextMantainanceTo: { type: Date, defualt: new Date() },
  maintainer: String,
  supervisor: String,
  place: String,
  maintainanceType: String
})

module.exports = mongoose.model('Inventory', schema)
