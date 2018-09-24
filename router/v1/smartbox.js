/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const multer = require('multer')
const crypto = require('crypto')
const mime = require('mime')
const router = new express.Router()

const Site = require(path.resolve('models/Site'))
const SmartBox = require(path.resolve('models/SmartBox'))

// Storage object specs
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, 'static/vehicular-flow'),
  filename: (req, file, callback) => {
    crypto.pseudoRandomBytes(16, (error, raw) => {
      callback(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype))
    })
  }
})

const upload = multer({ storage: storage }).fields([
  { name: 'photos', maxCount: 10 },
  { name: 'log', maxCount: 1 }
])

/* INSERT SMARTBOX EXCEPTION INTO SMARTBOX INFORMATION */
router.route('/smartbox/exception').post((req, res) => {
  const { id, description } = req.body
  if (!id || !description) return res.status(400).json({})
  return SmartBox.findOneAndUpdate({ id }, { $push: { exceptions: { description } } }).exec(
    error => {
      if (error) {
        winston.error(error)
        return res.status(500).json({ success: false, message: 'Could not save exception' })
      }
      return res.status(200).json({ success: true, message: 'Succesfully added exception' })
    }
  )
})

/* UPGRADE SMARTBOX. TODO: POST THIS REQUEST */
router.route('/smartbox/upgrade/:key').get((req, res) => {
  const { key } = req.params

  Site.findOne({ key })
    .select('key')
    .exec((error, smartbox) => {
      if (error) {
        winston.error(error)
        return res.status(500).json({ success: false, message: 'Could not find Smart Box' })
      }

      if (!smartbox) return res.status(404).json({ success: false, message: 'Specified Smartbox was not found' })

      global.io.to(key).emit('upgrade')
      return res.status(200).json({
        success: true,
        message: 'Initialized Smartbox debugging process',
        smartbox
      })
    })
})

/* ASK FOR DEBUG TO SMARTBOX */
router.route('/smartbox/debug/:key').get((req, res) => {
  const { key } = req.params

  Site.findOne({ key })
    .select('key')
    .exec((error, smartbox) => {
      if (error) {
        winston.error(error)
        return res.status(500).json({ success: false, message: 'Could not find Smart Box' })
      }

      if (!smartbox) return res.status(404).json({ success: false, message: 'Specified Smartbox was not found' })

      global.io.to(key).emit('debug')
      return res.status(200).json({
        success: true,
        message: 'Initialized Smartbox debugging process',
        smartbox
      })
    })
})

/* ENDPOINT FOR SMARTBOX TO POST INFORMATION WHEN DEBUGGING */
router.route('/smartbox/debug').post(upload, (req, res) => {
  const { id } = req.body
  const photoFiles = req.files.photos
  const photos = []

  if (!photoFiles) return res.status(400).json({ success: false, message: 'Malformed request. Empty photos' })

  photoFiles.forEach(photo => {
    photos.push(photo.filename)
  })

  return SmartBox.findOneAndUpdate(
    { id },
    { $push: { debugs: { photos } } },
    { $set: { debugs: { logFile: req.files.log[0] } } }
  ).exec(error => {
    if (error) {
      winston.error(error)
      return res.status(500).json({
        success: false,
        message: "The specified debug couldn't be created"
      })
    }

    return res.status(200).json({ success: true, message: 'Succesfully debugged Smartbox' })
  })
})

module.exports = router
