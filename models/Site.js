/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const History = new Schema({
  timestamp: { type: Number, default: Date.now() },
  event: String,
  status: String,
  risk: { type: Number, default: 0 },
  photos: [String]
})

const Counter = new Schema({
  inputs: [Number],
  outputs: [Number],
  timestamp: { type: Number, default: Date.now }
})

const schema = new Schema({
  key: { type: String, default: String(Date.now()) },
  name: { type: String, required: true },
  position: { type: [Number], required: true }, // Lat, lng
  sensors: [
    {
      key: Number,
      value: Number,
      class: String,
      fully_charged: Boolean,
      charging: Boolean,
      ac_present: Boolean,
      needs_replacement: Boolean
    },
    { _id: false }
  ],
  alarms: [
    {
      timestamp: { type: Number, default: Date.now() },
      event: String,
      status: String,
      risk: { type: Number, default: 0 },
      photos: [String]
    }
  ],
  timestamp: { type: Date, default: new Date() }, // Last updated
  history: { type: [History], default: [] },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  subzone: { type: Schema.Types.ObjectId, ref: 'Subzone' },
  zone: { type: Schema.Types.ObjectId, ref: 'Zone' },
  smartboxes: [{ type: Schema.Types.ObjectId, ref: 'SmartBox' }],
  country: String,
  cameras: [
    {
      id: String,
      name: String,
      room: String,
      videos: [String]
    }
  ],
  counter: { type: [Counter], default: [] }
})

// Set company-key unique
schema.index({ key: 1, company: 1 }, { unique: true })

module.exports = mongoose.model('Site', schema)
module.exports.History = mongoose.model('History', History)
module.exports.Counter = mongoose.model('Counter', Counter)
