/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class SiteClass {}

const History = new Schema({
  _id: false,
  timestamp: { type: Date, default: Date.now },
  event: String,
  status: String,
  risk: 0
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
      // battery fields
      fully_charged: Boolean,
      charging: Boolean,
      ac_present: Boolean,
      needs_replacement: Boolean
    },
    { _id: false }
  ],
  alarms: [
    {
      timestamp: { type: Date, default: Date.now },
      event: String,
      status: String,
      risk: 0
    },
    { _id: false }
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
  ]
})

// Set company-key unique
schema.index({ key: 1, company: 1 }, { unique: true })

schema.loadClass(SiteClass)

module.exports = mongoose.model('Site', schema)
module.exports.History = mongoose.model('History', History)
