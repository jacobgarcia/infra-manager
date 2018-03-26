const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const Schema = mongoose.Schema

const schema = new Schema({
  user: String,
  password: String,
  site: { type: String, ref: 'Site' },
  role: String
})

schema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('Admin', schema)
