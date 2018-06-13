/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const crypto = require('crypto')
const router = new express.Router()

const Site = require(path.resolve('models/Site'))
const Stream = require(path.resolve('models/Stream'))

/* GENERATE A TOKEN FOR POSTING TO A STREAMING ROOM */
router.route('/video/token').post((req, res) => {
  const { key, id } = req.body

  Site.findOne({ key }).exec((error, site) => {
    if (error) {
      winston.error({ error })
      return res
        .status(500)
        .json({ success: false, message: 'Could not create streaming', error })
    }
    if (!site) return res
        .status(404)
        .json({ success: false, message: 'Site was not found' })
    // Generate room unique token
    return crypto.pseudoRandomBytes(16, (error, raw) => {
      const room = raw.toString('hex') + Date.now()
      Stream.findOneAndUpdate({ id }, { $set: { room } }).exec(error => {
        if (error) {
          winston.error({ error })
          return res.status(500).json({
            success: false,
            message: 'Could not create streaming',
            error
          })
        }
        const data = { id, room }
        global.io.to(key).emit('streaming', data)

        return res.status(200).json({ room })
      })
    })
  })
})

/* GET ALL CAMERAS OF A SPECIFIED COMPANY */
router.route('/video/cameras').get((req, res) => {
  const company = req._user.cmp

  Stream.find({ company })
    .populate('site', 'key zone')
    .exec((error, cameras) => {
      if (error) {
        winston.error({ error })
        return res
          .status(500)
          .json({ success: false, message: 'Could not retrieve cameras' })
      }
      return res.status(200).json({
        success: true,
        message: 'Retrieved streaming cameras',
        cameras
      })
    })
})

module.exports = router
