/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

const Battery = require(path.resolve('models/Battery'))
const Report = require(path.resolve('models/Report'))
const Access = require(path.resolve('models/Access'))

// Return all logs from specific site
router.route('/cameras/logs/:camera').get((req, res) => {
  const camera = req.params.camera

  // Find battery logs
  Battery.find({ camera }).exec((error, batteryLogs) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ success: 'false', message: 'Could not retrieve battery log.' })
    }

    // Find Report logs
    return Report.find({ camera }).exec((error, reportLogs) => {
      if (error) {
        winston.error(error)
        return res.status(500).json({ success: 'false', message: 'Could not retrieve report log.' })
      }

      // Find access logs
      return Access.find({ camera }).exec((error, accessLogs) => {
        if (error) {
          winston.error(error)
          return res.status(500).json({
            success: 'false',
            message: 'Could not retrieve battery log.'
          })
        }

        return res.status(200).json({ success: true, batteryLogs, reportLogs, accessLogs })
      })
    })
  })
})

// Return last status only for report
// Return last status of access only (to know if the user is valid or not)
router.route('/cameras/report/shit/:site').get((req, res) => {
  const camera = req.params.site

  // Find battery logs
  Report.find({ camera }).exec((error, reportLogs) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ success: 'false', message: 'Could not retrieve report log.' })
    }
    if (!reportLogs) return res.status(404).json({
        success: false,
        message: 'The camera specified does not exists'
      })

    // order logs from most recent access to return the first element. Sync call, so no problem for the return
    reportLogs.sort(($0, $1) => {
      return parseFloat($1.timestamp) - parseFloat($0.timestamp)
    })
    return res.status(200).json({ success: true, report: reportLogs[0] })
    // return res.status(200).json( { 'success': true } ,reportLogs[0] )
  })
})

// Get a debug report for all cameras
router.route('/cameras/single/debug').post((req, res) => {
  const { camera } = req.body
  // Notify to all cameras
  global.io.to(camera).emit('debug')
  return res.status(200).json({
    succes: true,
    message: 'Initiated debugging process to all cameras'
  })
})

router.route('/cameras/alarm/fine').post((req, res) => {
  return res.status(404).json({
    success: 'false',
    message: 'Endpoint Deprecated'
  })
  // Update site sensors value
})

/** *** CAMERA LOGS ENDPOINTS ****/
router.route('/cameras/log/battery').post((req, res) => {
  const { camera, battery } = req.body

  new Battery({
    camera,
    battery
  }).save((error, log) => {
    // Save the log
    if (error) {
      winston.error(error)
      return res.status(500).json({ success: 'false', message: 'Could not save log.' })
    }
    return res.status(200).json({ success: true, log })
  })
})

/** *** CAMERA LOGS ENDPOINTS ****/
router.route('/cameras/log/battery').post((req, res) => {
  const { camera, battery } = req.body

  new Battery({
    camera,
    battery
  }).save((error, log) => {
    // Save the log
    if (error) {
      winston.error(error)
      return res.status(500).json({ success: 'false', message: 'Could not save log.' })
    }
    return res.status(200).json({ success: true, log })
  })
})

router.route('/cameras/log/report').post((req, res) => {
  const {
    vibration_one,
    vibration_two,
    door_one,
    door_two,
    battery,
    camera_one,
    camera_two
  } = req.body

  new Report({
    vibration_one,
    vibration_two,
    door_one,
    door_two,
    battery,
    camera_one,
    camera_two
  }).save((error, log) => {
    // Save the log
    if (error) {
      winston.error(error)
      return res.status(500).json({ success: 'false', message: 'Could not save log.' })
    }
    return res.status(200).json({ success: true, log })
  })
})
router.route('/cameras/log/access').post((req, res) => {
  const { camera, pin, status, photo } = req.body

  new Access({
    camera,
    pin,
    status,
    photo
  }).save((error, log) => {
    // Save the log
    if (error) {
      winston.error(error)
      return res.status(500).json({ success: 'false', message: 'Could not save log.' })
    }
    return res.status(200).json({ success: true, log })
  })
})

module.exports = router
