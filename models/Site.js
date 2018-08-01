/* eslint-env node */
const mongoose = require('mongoose')
const mongooseToCsv = require('mongoose-to-csv')
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
      needs_replacement: Boolean,
      isAlerted: Boolean
    },
    { _id: false }
  ],
  alarms: [
    {
      timestamp: { type: Number, default: Date.now() },
      event: String,
      status: String,
      risk: { type: Number, default: 0 },
      photos: [String],
      class: String,
      key: String
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
  counter: { type: [Counter], default: [] },
  onlineStatuses: [
    {
      type: Boolean,
      default: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]
    }
  ],
  devices: [
    {
      device: String,
      ip: String,
      last_update: Number,
      status: Number,
      output: [
        {
          key: String,
          value: String
        }
      ]
    },
    { _id: false }
  ],
  devices2: [
    {
      device: String,
      ip: String,
      last_update: Number,
      status: Number,
      output: [
        {
          key: String,
          value: String
        }
      ]
    },
    { _id: false }
  ],
  devices3: [
    {
      device: String,
      ip: String,
      last_update: Number,
      status: Number,
      output: [
        {
          key: String,
          value: String
        }
      ]
    },
    { _id: false }
  ]
})

schema.plugin(mongooseToCsv, {
  headers: 'ID Suceso Fecha Hora Sitio Zona Riesgo Estatus',
  virtuals: {
    ID: doc => {
      return doc._id
    },
    Suceso: doc => {
      return doc.event
    },
    Fecha: doc => {
      return new Date(doc.timestamp).toLocaleDateString()
    },
    Hora: doc => {
      return new Date(doc.timestamp).toLocaleTimeString()
    },
    Sitio: doc => {
      return doc.site
    },
    Zona: doc => {
      return doc.zone
    },
    Riesgo: doc => {
      return doc.risk
    },
    Estatus: doc => {
      return doc.status
    },
    Key: doc => {
      return doc.key
    }
  }
})

// Set company-key unique
schema.index({ key: 1, company: 1 }, { unique: true })

module.exports = mongoose.model('Site', schema)
module.exports.History = mongoose.model('History', History)
module.exports.Counter = mongoose.model('Counter', Counter)
