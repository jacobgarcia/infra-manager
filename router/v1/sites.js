/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

// const Site = require(path.resolve('models/Site'))
// const Zone = require(path.resolve('models/Zone'))
const Site = require(path.resolve('models/Site'))

router.route('/sites/list').get((req, res) => {
  const company = req._user.cmp

  Site.find({ company })
    .sort({ _id: 1 })
    .exec((error, sites) => {
      // if there are any errors, return the error
      if (error) {
        winston.error(error)
        return res
          .status(500)
          .json({ success: 'false', message: 'Error at finding sites' }) // return shit if a server error occurs
      } else if (!sites) return res
          .status(404)
          .json({ success: 'false', message: 'Sites not found' })
      return res.status(200).json({
        success: true,
        message: 'Successfully retrieved sites',
        sites
      })
    })
})

// Register new site
router.route('/sites/register').post((req, res) => {
  let { key, name, position, company, zone, subzone } = req.body

  position = JSON.parse(position)

  // return res.status(200).json({ 'success': true, 'message':position })

  new Site({
    key,
    name,
    position,
    company,
    zone,
    subzone
  }).save((error, site) => {
    // Save the user form
    if (error) {
      winston.error(error)
      return res.status(400).json({
        success: 'false',
        message: "The specified site couldn't be created",
        error: error
      })
    }
    return res
      .status(200)
      .json({ success: true, message: 'Successfully registered site' })
  })
})

// Register new site
router.route('/sites/down/sensor').post((req, res) => {
  let { site, sensors } = req.body
  sensors = JSON.parse(sensors)
  Site.find({ key: site }).exec((error, theSite) => {
    if (error) {
      winston.error(error)
      return res.status(400).json({
        success: 'false',
        message: 'The specified site does not exist'
      })
    } else if (!site || !sensors) {
      return res
        .status(400)
        .json({ success: 'false', message: 'value no spicified' })
    }
    Site.findOneAndUpdate({ key: site }, { $set: { sensors: sensors } }).exec(
      (error, newSite) => {
        if (error) {
          winston.error(error)
          return res.status(400).json({
            success: 'false',
            message: 'The specified site does not exist'
          })
        }
        return res
          .status(200)
          .json({ succes: true, message: 'sensor down', site: newSite })
      }
    )
  })
})

// ===deprecated==
router.route('/sites/getSensors').get((req, res) => {
  const inventoryReports = []
  Site.find(
    { sensors: { $exists: true } },
    { _id: 0, key: 1, 'sensors.key': 1, 'sensors.value': 1 }
  )
    .sort({ _id: 1 })
    .exec((error, sensors) => {
      // if there are any errors, return the error

      sensors.forEach(site => {
        site.sensors.forEach(sensor => {
          newSensor = {
            site: site.key,
            key: sensor.key,
            value: sensor.value,

            /* starting hardcoding*/
            brand: 'ophouse',
            idBrand: 'oph01',
            model: 'AWR9S75',
            name: 'sensor ophouse AWR9S75',
            photo: '/static/img/dummy/ac-02.jpg',
            type: 'Split Ventana',
            version: 1,
            _id: site.key,

            zone: {
              name: 'centro'
            },
            detailedStatus: {
              active: true,
              temperature: 15
            }
          }

          inventoryReports.push(newSensor)
        })
      })
      if (error) {
        winston.error(error)
        return res
          .status(500)
          .json({ success: 'false', message: 'Error at finding sites' }) // return shit if a server error occurs
      } else if (!sensors) return res
          .status(404)
          .json({ success: 'false', message: 'Sites not found' })
      return res.status(200).json({
        success: true,
        message: 'Successfully retrieved sites',
        inventoryReports
      })
    })
})

module.exports = router
