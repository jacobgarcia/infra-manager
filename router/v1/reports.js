/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const fs = require('fs')
const Json2csvParser = require('json2csv').Parser

const Site = require(path.resolve('models/Site'))

const fields = [
  {
    label: 'ID',
    value: '_id'
  },
  {
    label: 'Suceso',
    value: 'event'
  },
  {
    label: 'Fecha',
    value: 'date'
  },
  {
    label: 'Hora',
    value: 'hour'
  },
  {
    label: 'Sitio',
    value: 'site'
  },
  {
    label: 'Zona',
    value: 'zone'
  },
  {
    label: 'Riesgo',
    value: 'risk'
  },
  {
    label: 'Status',
    value: 'status'
  }
]

/* ADD PHOTO MEDIA FILES TO THE SPECIFIED ALARM THAT SERVERS AS EVIDENCE */
router.route('/reports/alarms').get((req, res) => {
  const company = req._user.cmp
  const alarms = []

  Site.find({ company })
    .populate('zone', 'name')
    .select('alarms name zone')
    .exec((error, sites) => {
      if (error) {
        winston.error({ error })
        return res.status(500).json({ error })
      }

      sites.map(site => {
        site.alarms.map(alarm => {
          const currentAlarm = {
            _id: alarm._id,
            event: alarm.event,
            date: new Date(alarm.timestamp).toLocaleDateString(),
            hour: new Date(alarm.timestamp).toLocaleTimeString(),
            site: site.name,
            zone: site.zone.name,
            risk: alarm.risk,
            status: alarm.status
          }
          alarms.push(currentAlarm)
        })
      })
      const json2csvParser = new Json2csvParser({ fields })
      const csv = json2csvParser.parse(alarms)

      return fs.writeFile('static/alarms.csv', csv, error => {
        if (error) {
          winston.error({ error })
          return res.status(500).json({ error })
        }
        return res.status(200).json({
          success: true,
          message: 'Successfully generated report',
          alarms
        })
      })
    })
})

/* GET REPORT FILE OF HOW MANY ALARMS PER SENSOR ACTIVATED */
router.route('/reports/alarms/count/:key').get((req, res) => {
  const company = req._user.cmp
  const { key } = req.params
  const alarms = []

  Site.aggregate(
    [
      { $match: { company, key } },
      { $project: { alarms: 1 } },
      { $unwind: '$alarms' },
      {
        $group: {
          _id: { alarm: '$alarms' },
          count: { $sum: 1 }
        }
      }
    ],
    (error, topAlarms) => {
      console.log(topAlarms)
      return res.status(200).json({
        success: true,
        message: 'Successfully generated report',
        topAlarms
      })
    }
  )
  // Site.findOne({ company, key })
  //   .select('alarms')
  //   .exec((error, site) => {
  //     if (error) {
  //       winston.error({ error })
  //       return res.status(500).json({ error })
  //     }
  //
  //     site.alarms.map(alarm => {
  //       const currentAlarm = {
  //         _id: alarm._id,
  //         event: alarm.event,
  //         date: new Date(alarm.timestamp).toLocaleDateString(),
  //         hour: new Date(alarm.timestamp).toLocaleTimeString(),
  //         site: site.name,
  //         zone: site.zone.name,
  //         risk: alarm.risk,
  //         status: alarm.status
  //       }
  //       alarms.push(currentAlarm)
  //     })
  //     const json2csvParser = new Json2csvParser({ fields })
  //     const csv = json2csvParser.parse(alarms)
  //
  //     return fs.writeFile('static/alarms.csv', csv, error => {
  //       if (error) {
  //         winston.error({ error })
  //         return res.status(500).json({ error })
  //       }
  //       return res.status(200).json({
  //         success: true,
  //         message: 'Successfully generated report',
  //         alarms
  //       })
  //     })
  //   })
})

module.exports = router
