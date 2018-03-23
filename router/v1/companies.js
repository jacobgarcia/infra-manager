/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const multer = require('multer')
const crypto = require('crypto')
const mime = require('mime')
const router = new express.Router()

const Site = require(path.resolve('models/Site'))
const Zone = require(path.resolve('models/Zone'))
const User = require(path.resolve('models/User'))
const Inventory = require(path.resolve('models/Inventory'))
const Company = require(path.resolve('models/Company'))
const SmartBox = require(path.resolve('models/SmartBox'))

const { hasAccess } = require(path.resolve('router/v1/lib/middleware-functions'))

// Storage object specs
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, 'static/vehicular-flow'),
  filename: (req, file, callback) => {
    crypto.pseudoRandomBytes(16, (error, raw) => {
      callback(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype))
    })
  }
})

const upload = multer({storage: storage}).fields([{ name: 'photos', maxCount: 10}, { name: 'log', maxCount: 1}])

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

router.route('/site/:siteKey')
.get((req, res) => {
  const { siteKey } = req.params

  Site.findOne({ 'key': siteKey })
  .exec((error, site) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!site) return res.status(404).json({ message: 'No sites found'})

    return res.status(200).json({ site })
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

// Get all face recognition registers
router.route('/inventory/:_id')
.put((req, res) => {
  const { _id } = req.params
  const { lastMantainanceFrom, lastMantainanceTo, maintainer, supervisor, place, maintainanceType } = req.body

  Inventory.findOneAndUpdate({ _id }, { $set: { lastMantainanceFrom, lastMantainanceTo, maintainer, supervisor, place, maintainanceType }})
  .exec((error, inventory) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    return res.status(200).json({ inventory })
  })
})

// Create site based on a central equipment (This endpoint must be called when a new smartbox connects to the server)
router.route('/sites/initialize')
.post((req, res) => {
  // Since is not human to check which company ObjectId wants to be used, a search based on the name is done
  const { id, version, company, key, name, position, sensors, country } = req.body

  Company.findOne({ name: company })
  .exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res.status(404).json({ success: false, message: 'Specified company was not found'})

    // Check if smartbox has been already created
    new SmartBox({
      id,
      version
    })
    .save((error, smartbox) => {
      if (error) {
        winston.error(error)
        return res.status(401).json({ success: false, message: 'Smartbox already registered' })
      }

      // Create site using the information in the request body
      new Site({
        key,
        name,
        position,
        company: company._id,
        sensors,
        smartboxes: smartbox,
        country
      })
      .save(error => {
        if (error) {
          winston.error(error)
        }
        // Site already registred but smartbox does not. Update the site
        Site.findOneAndUpdate({ key, company: company._id }, { $push: { smartboxes: smartbox._id }})
        .exec((error, site) => {
          if (error) {
            winston.error(error)
            return res.status(400).json({ success: false, message: 'Could not add the smartbox to the already created site' })
          }
          // Add the new site to the specified subzone
          return res.status(200).json({ site })
        })
      })
    })
  })
})

router.route('/smartbox/exception')
.post((req, res) => {
  const { id, description } = req.body
  SmartBox.findOneAndUpdate({ id }, { $push: { exceptions: { description } } })
  .exec((error, smartbox) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({'success': false, 'message': "Could not save exception"})
    }
    return res.status(200).json({ 'success': true, smartbox })
  })
})

router.route('/smartbox/debug/:id')
.get((req, res) => {
  const { id } = req.params

  SmartBox.findOne({ id })
  .exec((error, smartbox) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({'success': false, 'message': "Could not find Smart Box"})
    }

    if (!smartbox) return res.status(404).json({ success: false, message: "Specified Smartbox was not found"})

    global.io.to(id).emit('debug')
    return res.status(200).json({ 'success': true, message: 'Initialized Smartbox debugging process', smartbox })

  })
})

// post Smartbox debug
router.route('/smartbox/debug/:id')
.post(upload, (req,res) => {
  const { id } = req.params
  const photoFiles = req.files.photos
  console.log(req.files)
  const photos = []

  if (!photoFiles) return res.status(400).json({ success: false, message: 'Malformed request. Empty photos'})

  photoFiles.forEach(photo => {
    photos.push(photo.filename)
  })

  SmartBox.findOneAndUpdate({ id }, { $push: { debugs: { photos } } }, {$set: { debugs: { logFile: req.files.log[0] } }})
  .exec((error, smartbox) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({success: false, message: "The specified debug couldn't be created"})
    }

    return res.status(200).json({ 'success': true, smartbox})

  })
})

router.route('/sites/sensors')
.put((req, res) => {
  const { key, company, sensors } = req.body
  console.log(sensors)
  JSON.parse(sensors)
  console.log(sensors)
  // Since is not human to check which company ObjectId wants to be used, a search based on the name is done
  Company.findOne({ name: company })
  .exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res.status(404).json({ success: false, message: 'Specified company was not found'})

    Site.findOneAndUpdate({ company, key }, { $set: { sensors }})
    .exec((error, site) => {
      if (error) {
        winston.error({error})
        return res.status(500).json({ error })
      }

      if (!site) return res.status(404).json({ success: false, message: 'No site found'})

      return res.status(200).json({ success: true, message: 'Updated sensor information sucessfully', site })
    })
  })
})

router.route('/sites/sensors')
.get((req, res) => {
  const company = req._user.cmp

  Site.find({ company })
  .select('sensors key')
  .exec((error, sites) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!sites) return res.status(404).json({ message: 'No sites found'})

    return res.status(200).json({ sites })
  })
})

module.exports = router
