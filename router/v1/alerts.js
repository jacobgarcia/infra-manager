/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

// const Site = require(path.resolve('models/Site'))
// const Zone = require(path.resolve('models/Zone'))
// const Admin = require(path.resolve('models/Admin'))
const Alert = require(path.resolve('models/Alert'))

/** *** ALERTS ****/
router.route('/alerts/').post((req, res) => {
  const { site, alert } = req.body
  const data = { site, alert }

  // Emit alert socket
  global.io.to('ATT').emit('alert', data)
  global.io.to('connus').emit('alert', data)

  // Mail options
  const mailOneOptions = {
    from: 'ingenieria@connus.mx',
    to: 'enrique@connus.mx',
    subject: 'ALERTA EN SITIO ' + site,
    text:
      'Sensor ' +
      alert +
      ' alertado en sitio ' +
      site +
      '. Por favor póngase en contacto con el cliente lo antes posible'
  }

  const mailTwoOptions = {
    from: 'ingenieria@connus.mx',
    to: 'aida@connus.mx',
    subject: 'ALERTA EN SITIO ' + site,
    text:
      'Sensor ' +
      alert +
      ' alertado en sitio ' +
      site +
      '. Por favor póngase en contacto con el cliente lo antes posible'
  }

  // transporter.sendMail(mailOneOptions, (error, info) => {
  //   if (error) winston.error(error)
  //   else winston.info('First email sent: ' + info.response)
  // })
  //
  // transporter.sendMail(mailTwoOptions, (error, info) => {
  //   if (error) winston.error(error)
  //   else winston.info('Second email sent: ' + info.response)
  // })

  // Insert alert to database
  new Alert({
    site,
    alert
  }).save((error, log) => {
    // Save the log
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: 'false', message: 'Could not save log.' })
    }
    return res
      .status(200)
      .json({ success: true, message: 'Sent alert to client' })
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
