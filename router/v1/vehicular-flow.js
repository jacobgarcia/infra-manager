/* eslint-env node */
const express = require('express')
const winston = require('winston')
const multer = require('multer')
const crypto = require('crypto')
const mime = require('mime')
const path = require('path')
const OpenalprApi = require('openalpr_api')
const apiInstance = new OpenalprApi.DefaultApi()
const secretKey = 'sk_05468adb39752b42f537ec6a'
const router = new express.Router()

const VehicularReport = require(path.resolve('models/VehicularReport'))
const Site = require(path.resolve('models/Site'))

// Storage object specs
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, 'static/vehicular-flow'),
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
const upload = multer({ storage: storage }).fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 },
  { name: 'video', maxCount: 2 }
])
const file = multer({ storage: storage }).single('file')

router.route('/vehicular-flow/recognize').post(upload, (req, res) => {
  // Receieve photo as file and upload it
  const { key, domain } = req.body
  const company = req._user.cmp

  let image =
    'https://' +
    domain +
    '.connus.mx/static/vehicular-flow/' +
    req.files.back[0].filename
  if (process.env.NODE_ENV === 'development') image = 'https://demo.connus.mx/static/img/dummy/lpr-06.jpg'

  Site.findOne({ key }).exec((error, detailedSite) => {
    if (error) {
      winston.error({ error })
      return res
        .status(500)
        .json({ success: false, message: 'Could not find site', error })
    }

    if (!detailedSite) return res.status(404).json({ success: false, message: 'Site not found' })

    // Defines the training data used by OpenALPR
    const country = 'us'

    // Recognize vehicle information
    const options = {
      recognizeVehicle: 1 // Integer | If set to 1, the vehicle will also be recognized in the image This requires an additional credit per request
    }

    // Call vehicle recognition API instance
    apiInstance.recognizeUrl(
      image,
      secretKey,
      country,
      options,
      (error, data) => {
        if (error) {
          winston.error({ error })
          return res.status(500).json({
            success: false,
            message: 'Could not process OpenALPR API call',
            error
          })
        }

        if (data.results.length < 1) {
          new VehicularReport({
            zone: 'Centro',
            site: key,
            front: '/static/vehicular-flow/' + req.files.front[0].filename,
            back: '/static/vehicular-flow/' + req.files.back[0].filename,
            video: '/static/vehicular-flow/' + req.files.video[0].filename,
            company,
            risk: 1,
            event: 'No se encontraron resultados de análisis'
          }).save((error, report) => {
            if (error) {
              winston.error({ error })
              return res.status(500).json({ error })
            }
            return res.status(404).json({
              success: false,
              message: 'Results not found. Created alert',
              report
            })
          })
        } else {
          new VehicularReport({
            vehicle: data.results[0].vehicle.body_type[0].name,
            zone: 'Centro',
            site: key,
            front: '/static/vehicular-flow/' + req.files.front[0].filename,
            back: '/static/vehicular-flow/' + req.files.back[0].filename,
            video: '/static/vehicular-flow/' + req.files.video[0].filename,
            brand: data.results[0].vehicle.make[0].name,
            model: data.results[0].vehicle.make_model[0].name,
            color: data.results[0].vehicle.color[0].name,
            plate: data.results[0].plate,
            region: data.results[0].region,
            company
          }).save((error, report) => {
            if (error) {
              winston.error({ error })
              return res.status(500).json({ error })
            }
            return res.status(200).json({ report })
          })
        }
      }
    )
  })
})

router.route('/vehicular-flow/reports').get((req, res) => {
  const company = req._user.cmp

  VehicularReport.find({ company }).exec((error, reports) => {
    if (error) {
      winston.error({ error })
      return res.status(500).json({ error })
    }

    return res.status(200).json({ reports })
  })
})

router.route('/file/upload').post(file, (req, res) => {
  return res.status(200).json({
    filename:
      'https://demo.connus.mx/static/vehicular-flow/' + req.file.filename
  })
})

module.exports = router
