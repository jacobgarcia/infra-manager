/* eslint-env node */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

class StateClass {
  // Methods
}

const schema = new Schema({

  camera: String,
  c1: Boolean,
  c2: Boolean,
  v1: Boolean,
  v2: Boolean,
  photo: String,
  pc1: String,
  pc2: String

})

schema.loadClass(StateClass)


module.exports = mongoose.model('Debug', schema)
