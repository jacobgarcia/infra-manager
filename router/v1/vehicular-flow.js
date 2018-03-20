/* eslint-env node */
const express = require('express')
const winston = require('winston')
const multer = require('multer')
const crypto = require('crypto')
const mime = require('mime')
const OpenalprApi = require('openalpr_api')
const apiInstance = new OpenalprApi.DefaultApi()
const secretKey = 'sk_00083b316c1a01c22ea1a196'
const router = new express.Router()

// Storage object specs
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, 'static/vehicular-flow'),
  filename: (req, file, callback) => {
    crypto.pseudoRandomBytes(16, (error, raw) => {
      callback(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype))
    })
  }
})

// Upload object specs
const upload = multer({storage: storage}).single('image') // single file upload using this variable

router.route('/vehicular-flow/recognize')
.post(upload, (req, res) => {
  // Receieve photo as file and upload it.
  const image = 'https://demo.connus.mx/static/img/dummy/lpr-06.jpg'
  // const image = 'https://demo.connus.mx/static/vehicular-flow' + req.file.filename
  // Defines the training data used by OpenALPR
  const country = 'us'

  // Recognize vehicle information
  const options = {
    'recognizeVehicle': 1 // Integer | If set to 1, the vehicle will also be recognized in the image This requires an additional credit per request
  }

  // Call vehicle recognition API instance
  apiInstance.recognizeUrl(image, secretKey, country, options, (error, data) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    return res.status(200).json({ data })
  })
})

module.exports = router
