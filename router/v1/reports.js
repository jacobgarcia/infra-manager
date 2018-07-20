/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const fs = require('fs')

const Site = require(path.resolve('models/Site'))

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
          alarm.site = site.name
          alarm.zone = site.zone.name
          alarms.push(alarm)
        })
      })

      Site.csvReadStream(alarms).pipe(fs.createWriteStream('static/alarms.csv'))
      return res
        .status(200)
        .json({ success: true, message: 'Successfully generated report' })
    })
})

module.exports = router
