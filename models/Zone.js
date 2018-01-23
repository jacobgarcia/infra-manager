/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  name: {type: String, required: true},
  positions: {
    type: [[Number]],
    required: true
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { toJSON: { virtuals: true } })

schema.virtual('sites', {
  ref: 'Site',
  localField: '_id',
  foreignField: 'zone',
  justOne: false
})

module.exports = mongoose.model('Zone', schema)
