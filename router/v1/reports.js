/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const mongooseToCsv = require('mongoose-to-csv')
const fs = require('fs')

const Site = require(path.resolve('models/Site'))

Site.plugin(mongooseToCsv, {
  headers: 'ID Suceso Fecha Hora Sitio Zona Riesgo Estatus',
  virtuals: {
    ID: doc => {
      return doc._id
    },
    Suceso: doc => {
      return doc.event
    },
    Fecha: doc => {
      return doc.timestamp
    },
    Hora: doc => {
      return doc.timestamp
    },
    Sitio: doc => {
      return doc.site
    },
    Zona: doc => {
      return doc.zone
    },
    Riesgo: doc => {
      return doc.risk
    },
    Estatus: doc => {
      return doc.status
    }
  }
})

/* ADD PHOTO MEDIA FILES TO THE SPECIFIED ALARM THAT SERVERS AS EVIDENCE */
router.route('/reports/alarms').get((req, res) => {
  const company = req._user.cmp
  const alarms = []

  Site.find({ company })
    .populate('zone')
    .select('alarms')
    .exec((error, sites) => {
      sites.map(site => {
        site.alarms.map(alarm => {
          alarm.site = site.name
          alarm.zone = site.zone.name
          alarms.push(alarm)
        })
      })
    })
    .then(docs => {
      Site.csvReadStream(docs).pipe(fs.createWriteStream('alarms.csv'))
    })

  return res.status(200).json({ success: true })
})

module.exports = router
