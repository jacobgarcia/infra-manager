/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const multer = require('multer')
const crypto = require('crypto')
const mime = require('mime')
const request = require('request')


// const Site = require(path.resolve('models/Site'))
// const Zone = require(path.resolve('models/Zone'))
const Debug = require(path.resolve('models/Debug'))
const mongoose = require('mongoose')

// Storage object specs
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, 'static/uploads'),
  filename: (req, file, callback) => {
    crypto.pseudoRandomBytes(16, (error, raw) => {
      callback(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype))
    })
  }
})

// Upload object specs
const upload = multer({storage: storage}).array('photos', 3) //single file upload using this variable

// post camera debug
router.route('/debug/request/multiple')
.post(upload, (req,res) => {
    const {camera,
         c1,
         c2,
         v1,
         v2
  } = req.body

  const photos = req.files

  new Debug({camera,
             c1,
             c2,
             v1,
             v2,
             photo: '/static/uploads/' + photos[0].filename,
             pc1:  '/static/uploads/' + photos[1].filename,
             pc2:  '/static/uploads/' + photos[2].filename,
          })
  .save((error, debug) => { // Save debug request
    if (error) {
      winston.error(error)
      return res.status(400).json({'success': "false", 'message': "The specified debug couldn't be created","error":error})
    }
    else {

    data = {
      'image1': '/static/uploads/' + photos[0].filename,
      'image2': '/static/uploads/' + photos[1].filename,
      'image3': '/static/uploads/' + photos[2].filename,
      'c1':c1,
      'c2':c2,
      'v1':v1,
      'v2':v2
    }

    global.io.to('connus').emit('debugRequest',data)
    global.io.to('web-platform').emit('debugRequest',data)

      return res.status(200).json({ 'success': true, 'message': "Successfully registered debug" })
    }
  })

})


module.exports = router
