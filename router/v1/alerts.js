/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const request = require('request')

const Alert = require(path.resolve('models/Alert'))
const Site = require(path.resolve('models/Site'))
const Company = require(path.resolve('models/Company'))

/** *** ALERTS ****/
// PATCH: This method will be DEPRECATED but since ATT FRMs are using this, until we update them we'll be using this patch
router.route('/alerts').post((req, res) => {
  const { site, alert } = req.body
  const data = { site, alert }

  // Emit alert socket
  global.io.to('connus').emit('alert', data)

  Company.findOne({ name: 'AT&T' }).exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res
        .status(404)
        .json({ success: false, message: 'Specified company was not found' })

    // First, find the sensor for the specified KEY
    Site.findOne({ company, key: site }).exec((error, currentSite) => {
      if (error) {
        winston.error(error)
        return res
          .status(500)
          .json({ success: false, message: 'Could not update sensors' })
      }
      if (!currentSite) return res
          .status(404)
          .json({ success: false, message: 'Site not found' })

      // Since we have shitty name for sensors we have to transform it into the new way of doing it
      let key,
        type = null
      switch (alert) {
        case 'contactsensor1':
          key = 1
          type = 'contact'
          break
        case 'contactsensor2':
          key = 2
          type = 'contact'
          break
        case 'vibrationsensor1':
          key = 1
          type = 'vibration'
          break
        case 'vibrationsensor2':
          key = 2
          type = 'vibration'
          break
        default:
      }

      // Find which element must need to be modified
      const sensor = currentSite.sensors.find(
        $0 => $0.key === key && $0.class === type
      )

      console.log(sensor, key, type, currentSite)

      // Set sensor value to 0. All 0's are bad in thos context
      if (sensor) sensor.value = 0
      const body = {
        key: site,
        company: 'AT&T',
        sensors: currentSite.sensors
      }

      request.put(
        {
          url: 'https://api.connus.mx/v1/sites/sensors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + req._token,
            body
          }
        },
        error => {
          if (error) {
            winston.error(error)
            return res
              .status(500)
              .json({ success: false, message: 'Could not update sensors' })
          }
          return res
            .status(200)
            .json({ success: true, message: 'Sent alert to client' })
        }
      )
    })
  })
})

// Retrieve all ALERTS
router.route('/alerts/').get((req, res) => {
  Alert.find({})
    .sort({ timestamp: -1 })
    .exec((error, alerts) => {
      if (error) {
        winston.error(error)
        return res
          .status(500)
          .json({ success: 'false', message: 'Error at finding alerts' }) // return shit if a server error occurs
      } else if (!alerts) {
        return res
          .status(404)
          .json({ success: 'false', message: 'Alerts not found' })
      }
      return res.status(200).json({ success: true, alerts })
    })
})

// Count ALERTS for specific sensor of particular site
router.route('/alerts/count/:site').get((req, res) => {
  const { site } = req.params
  Alert.count({ site, alert: 'contactsensor1' }).exec((error, contactone) => {
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: 'false', message: 'Error at finding alerts' }) // return shit if a server error occurs
    }
    Alert.count({ site, alert: 'contactsensor2' }).exec((error, contacttwo) => {
      if (error) {
        winston.error(error)
        return res
          .status(500)
          .json({ success: 'false', message: 'Error at finding alerts' }) // return shit if a server error occurs
      }
      Alert.count({ site, alert: 'vibrationsensor1' }).exec(
        (error, vibrationone) => {
          if (error) {
            winston.error(error)
            return res.status(500).json({
              success: 'false',
              message: 'Error at finding alerts'
            }) // return shit if a server error occurs
          }
          Alert.count({ site, alert: 'vibrationsensor2' }).exec(
            (error, vibrationtwo) => {
              if (error) {
                winston.error(error)
                return res.status(500).json({
                  success: 'false',
                  message: 'Error at finding alerts'
                }) // return shit if a server error occurs
              }
              return res.status(200).json({
                success: true,
                contactone,
                contacttwo,
                vibrationone,
                vibrationtwo
              })
            }
          )
        }
      )
    })
  })
})

module.exports = router
