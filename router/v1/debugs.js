/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const multer = require('multer')
const crypto = require('crypto')
const mime = require('mime')
const base64Img = require('base64-img')
const shortid = require('shortid')

// const Site = require(path.resolve('models/Site'))
// const Zone = require(path.resolve('models/Zone'))
const Debug = require(path.resolve('models/Debug'))
const Exception = require(path.resolve('models/Exception'))

// Storage object specs
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, 'static/uploads'),
  filename: (req, file, callback) => {
    crypto.pseudoRandomBytes(16, (error, raw) => {
      callback(
        null,
        raw.toString('hex') +
          Date.now() +
          '.' +
          mime.getExtension(file.mimetype)
      )
    })
  }
})

// Upload object specs
const upload = multer({ storage: storage }).array('photos', 3) // single file upload using this variable

// post camera debug
router.route('/debug/request').post((req, res) => {
  const { camera, c1, c2, v1, v2, photo, pc1, pc2 } = req.body

  const filename = base64Img.imgSync(
    photo,
    'static/photos',
    shortid.generate() + Date.now()
  )
  const filename1 = base64Img.imgSync(
    pc1,
    'static/photos',
    shortid.generate() + Date.now()
  )
  const filename2 = base64Img.imgSync(
    pc2,
    'static/photos',
    shortid.generate() + Date.now()
  )

  new Debug({
    camera,
    c1,
    c2,
    v1,
    v2,
    photo: '/' + filename,
    pc1: '/' + filename1,
    pc2: '/' + filename2
  }).save((error, debug) => {
    // Save debug request
    if (error) {
      winston.error(error)
      return res.status(400).json({
        success: 'false',
        message: "The specified debug couldn't be created",
        error: error
      })
    }
    data = {
      image1: '/' + filename,
      image2: '/' + filename1,
      image3: '/' + filename2,
      c1: c1,
      c2: c2,
      v1: v1,
      v2: v2,
      site: camera
    }

    global.io.to('connus').emit('debugRequest', data)
    global.io.to('web-platform').emit('debugRequest', data)

    return res
      .status(200)
      .json({ success: true, message: 'Successfully registered debug' })
  })
})

// post camera debug

// debug camera request for simple id
router.route('/debug/request/:id').get((req, res) => {
  const id = req.params.id
  // find id
  Debug.findOne({ camera: id }).exec((error, camera) => {
    if (camera) {
      // return camera
      return res.status(200).json({ succes: true, camera })
      // global.io.emit('singleDebug',camera)
    }
    return res
      .status(400)
      .json({ success: 'false', message: 'Error loading data' })
  })
})
// post camera debug
router.route('/debug/request/multiple').post(upload, (req, res) => {
  const { camera, c1, c2, v1, v2 } = req.body
  const photos = req.files

  new Debug({
    camera,
    c1,
    c2,
    v1,
    v2,
    photo: '/static/uploads/' + photos[0].filename,
    pc1: '/static/uploads/' + photos[1].filename,
    pc2: '/static/uploads/' + photos[2].filename
  }).save((error, debug) => {
    // Save debug request
    if (error) {
      winston.error(error)
      return res.status(400).json({
        success: 'false',
        message: "The specified debug couldn't be created",
        error: error
      })
    }
    data = {
      image1: '/static/uploads/' + photos[0].filename,
      image2: '/static/uploads/' + photos[1].filename,
      image3: '/static/uploads/' + photos[2].filename,
      c1: c1,
      c2: c2,
      v1: v1,
      v2: v2
    }

    global.io.to('connus').emit('debugRequest', data)
    global.io.to('web-platform').emit('debugRequest', data)

    return res
      .status(200)
      .json({ success: true, message: 'Successfully registered debug' })
  })
})

router.route('/debug/exception').post((req, res) => {
  const { camera, exception } = req.body

  new Exception({
    camera,
    exception
  }).save((error, log) => {
    // Save the log
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: 'false', message: 'Could not save exception.' })
    }
    return res.status(200).json({ success: true, log })
  })
})

module.exports = router
