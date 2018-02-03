/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

const Site = require(path.resolve('models/Site'))
const Zone = require(path.resolve('models/Zone'))
const User = require(path.resolve('models/User'))

const { hasAccess } = require(path.resolve('router/v1/lib/middleware-functions'))

router.route('/users')
.get(hasAccess(4), (req, res) => {
  const company = req._user.cmp
  // TODO add monitoring zones or subzones
  User.find({ company })
  .select('email name surname access zones')
  .populate('zones', 'name')
  .then(users => {
    return res.status(200).json({ users })
  })
  .catch(error => {
    winston.error({error})
    return res.status(500).json({ error })
  })

})

// Save sites and stream change
router.route('/zones/:zone/sites')
.post((req, res) => {
    const { name, position } = req.body
    let key = req.body.key
    const { zone } = req.params
    const company = req._user.cmp

    if (key === null || key === 'null') key = String(Date.now())

    // Create site using the information in the request body
    new Site({
      key,
      name,
      position,
      zone,
      company
    })
    .save((error, site) => {
      if (error) {
        winston.error({error})
        return res.status(500).json({ error })
      }
      // Add the new site to the specified subzone
      return res.status(200).json({ site })
    })
})

//  Save zone and stream change
router.route('/zones')
.post((req, res) => {
    const { name, positions } = req.body
    const company = req._user.cmp

    // Create subzone using the information in the request body
    new Zone({
      name,
      positions,
      company
    })
    .save((error, zone) => {
        if (error) {
          winston.error({error})
          return res.status(500).json({ error })
        }

        return res.status(200).json({ zone })
    })
})

// Save sensors and alarms, add to history and stream change
router.route('/:siteKey/reports')
.put((req, res) => {
    const { sensors, alarms } = req.body
    const { siteKey } = req.params
    const company = req._user.cmp

    winston.info({key: siteKey, company})

    Site.findOne({key: siteKey, company})
    .exec((error, site) => {
      if (!site) return res.status(404).json({ message: 'No site found'})

      // TODO just update the returned site
      return Site.findByIdAndUpdate(site, { $push: { history: { sensors: site.sensors, alarms: site.alarms} } }, { new: true })
      .populate('zone', 'name')
      .populate('subzone', 'name')
      .exec((error, populatedSite) => {
        if (sensors) site.sensors = sensors
        site.alarms = alarms

        site.save((error, updatedSite) => {

          if (error) {
            winston.error({error})
            return res.status(500).json({ error })
          }

          const report = {
            site: {
              _id: updatedSite._id,
              key: updatedSite.key
            },
            zone: populatedSite.zone,
            subzone: populatedSite.subzone,
            timestamp: updatedSite.timestamp,
            sensors: updatedSite.sensors,
            alarms: updatedSite.alarms
          }

          // global.io.emit('report', report)
          global.io.to(`${company}-${siteKey}`).emit('report', report)
          return res.status(200).json(report)
        })
      })

    })
})

// Get zones. TODO: Retrieve only company zones
router.route('/zones')
.get((req, res) => {
  const company = req._user.cmp

  Zone.find({ company })
  .exec((error, zones) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!zones) return res.status(404).json({ message: 'No zones found'})

    return res.status(200).json({ zones })
  })
})

router.route('/sites')
.get((req, res) => {
  const company = req._user.cmp

  Site.find({ company })
  .exec((error, sites) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!sites) return res.status(404).json({ message: 'No sites found'})

    return res.status(200).json({ sites })
  })
})

// Get last report for all sites
router.route('/reports')
.get((req, res) => {
  const company = req._user.cmp

  Site.find({ company })
  .populate('zone', 'name')
  .exec((error, sites) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    const reports = sites.map(site => ({
      site: {
        _id: site._id,
        key: site.key
      },
      zone: site.zone,
      timestamp: site.timestamp,
      sensors: site.sensors,
      alarms: site.alarms
    }))

    return res.status(200).json({ reports })
  })
})

// Get zones, subzones and sites
router.route('/exhaustive')
.get((req, res) => {
  const company = req._user.cmp

  Zone.find({ company })
  .select('name positions subzones')
  .populate('sites')
  .exec((error, zones) => {

    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }
    if (!zones) return res.status(404).json({ message: 'No zones found'})

    return res.status(200).json({ zones })

  })
})

module.exports = router
