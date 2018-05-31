/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const multer = require('multer')
const crypto = require('crypto')
const mime = require('mime')
const router = new express.Router()
const base64Img = require('base64-img')
const shortid = require('shortid')

const Site = require(path.resolve('models/Site'))
const Zone = require(path.resolve('models/Zone'))
const User = require(path.resolve('models/User'))
const Inventory = require(path.resolve('models/Inventory'))
const Company = require(path.resolve('models/Company'))
const SmartBox = require(path.resolve('models/SmartBox'))
const Stream = require(path.resolve('models/Stream'))
const Counter = require(path.resolve('models/Counter'))

const { hasAccess } = require(path.resolve(
  'router/v1/lib/middleware-functions'
))

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

const upload = multer({ storage: storage }).fields([
  { name: 'photos', maxCount: 10 },
  { name: 'log', maxCount: 1 }
])

router.route('/users').get(hasAccess(4), (req, res) => {
  const company = req._user.cmp
  global.io.emit('report', report)
  // TODO add monitoring zones or subzones
  User.find({ company })
    .select('email name surname access zones')
    .populate('zones', 'name')
    .then(users => {
      return res.status(200).json({ users })
    })
    .catch(error => {
      winston.error({ error })
      return res.status(500).json({ error })
    })
})

// Save sites and stream change
router.route('/zones/:zone/sites').post((req, res) => {
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
  }).save((error, site) => {
    if (error) {
      winston.error({ error })
      return res.status(500).json({ error })
    }
    // Add the new site to the specified subzone
    return res.status(200).json({ site })
  })
})

//  Save zone and stream change
router.route('/zones').post((req, res) => {
  const { name, positions } = req.body
  const company = req._user.cmp

  // Create subzone using the information in the request body
  new Zone({
    name,
    positions,
    company
  }).save((error, zone) => {
    if (error) {
      winston.error({ error })
      return res.status(500).json({ error })
    }

    return res.status(200).json({ zone })
  })
})

// Save sensors and alarms, add to history and stream change
router.route('/:siteKey/reports').put((req, res) => {
  const { sensors, alarms } = req.body
  const { siteKey } = req.params
  const company = req._user.cmp

  winston.info({ key: siteKey, company })
  Site.findOne({ key: siteKey, company }).exec((error, site) => {
    if (!site) return res.status(404).json({ message: 'No site found' })

    // TODO just update the returned site
    return Site.findByIdAndUpdate(
      site,
      { $push: { history: { sensors: site.sensors, alarms: site.alarms } } },
      { new: true }
    )
      .populate('zone', 'name')
      .populate('subzone', 'name')
      .exec((error, populatedSite) => {
        if (sensors) site.sensors = sensors
        site.alarms = alarms

        site.save((error, updatedSite) => {
          if (error) {
            winston.error({ error })
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
router.route('/zones').get((req, res) => {
  const company = req._user.cmp

  Zone.find({ company }).exec((error, zones) => {
    if (error) {
      winston.error({ error })
      return res.status(500).json({ error })
    }

    if (!zones) return res.status(404).json({ message: 'No zones found' })

    return res.status(200).json({ zones })
  })
})

router.route('/sites').get((req, res) => {
  const company = req._user.cmp

  Site.find({ company }).exec((error, sites) => {
    if (error) {
      winston.error({ error })
      return res.status(500).json({ error })
    }

    if (!sites) return res.status(404).json({ message: 'No sites found' })

    return res.status(200).json({ sites })
  })
})

router.route('/site/:siteKey').get((req, res) => {
  const { siteKey } = req.params

  Site.findOne({ key: siteKey }).exec((error, site) => {
    if (error) {
      winston.error({ error })
      return res.status(500).json({ error })
    }

    if (!site) return res.status(404).json({ message: 'No sites found' })

    return res.status(200).json({ site })
  })
})

// Get last report for all sites
router.route('/reports').get((req, res) => {
  const company = req._user.cmp
  // global.io.emit('report', report)
  Site.find({ company })
    .populate('zone', 'name')
    .exec((error, sites) => {
      if (error) {
        winston.error({ error })
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
router.route('/exhaustive').get((req, res) => {
  const company = req._user.cmp

  Zone.find({ company })
    .select('name positions subzones')
    .populate('sites')
    .exec((error, zones) => {
      if (error) {
        winston.error({ error })
        return res.status(500).json({ error })
      }
      if (!zones) return res.status(404).json({ message: 'No zones found' })

      return res.status(200).json({ zones })
    })
})

// Get all face recognition registers
router.route('/inventory/:_id').put((req, res) => {
  const { _id } = req.params
  const {
    lastMantainanceFrom,
    lastMantainanceTo,
    maintainer,
    supervisor,
    place,
    maintainanceType
  } = req.body

  Inventory.findOneAndUpdate(
    { _id },
    {
      $set: {
        lastMantainanceFrom,
        lastMantainanceTo,
        maintainer,
        supervisor,
        place,
        maintainanceType
      }
    }
  ).exec((error, inventory) => {
    if (error) {
      winston.error({ error })
      return res.status(500).json({ error })
    }

    return res.status(200).json({ inventory })
  })
})

// Create site based on a central equipment (This endpoint must be called when a new smartbox connects to the server)
router.route('/sites/initialize').post((req, res) => {
  // Since is not human to check which company ObjectId wants to be used, a search based on the name is done
  const { id, version, company, key, name, country, zone } = req.body
  let { position, sensors, cameras } = req.body

  if (
    !id ||
    !version ||
    !company ||
    !key ||
    !name ||
    !position ||
    !sensors ||
    !cameras ||
    !country ||
    !zone
  ) return res
      .status(400)
      .json({ success: false, message: 'Malformed request' })
  if (typeof sensors === 'string' || typeof cameras === 'string') {
    sensors = JSON.parse(sensors)
    cameras = JSON.parse(cameras)
    position = JSON.parse(position)
  }

  Company.findOne({ name: company }).exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res
        .status(404)
        .json({ success: false, message: 'Specified company was not found' })

    // Check if smartbox has been already created
    new SmartBox({
      id,
      version
    }).save((error, smartbox) => {
      if (error) {
        winston.error(error)
        return res.status(403).json({
          success: false,
          message: 'Smartbox already registered',
          error
        })
      }

      // Always set to zone Centro
      Zone.findOne({ name: zone, company: company._id }).exec((error, zone) => {
        if (error) {
          winston.error(error)
          return res.status(500).json({ error })
        }

        if (!zone) return res
            .status(404)
            .json({ success: false, message: 'Specified zone was not found' })
        // Create site using the information in the request body
        new Site({
          key,
          name,
          position,
          company: company._id,
          sensors,
          cameras,
          smartboxes: smartbox,
          country,
          zone: zone._id
        }).save(error => {
          if (error) {
            winston.error(error)
          }
          // Site already registred but smartbox does not. Update the site
          Site.findOneAndUpdate(
            { key, company: company._id },
            { $push: { smartboxes: smartbox._id } }
          ).exec((error, site) => {
            if (error) {
              winston.error(error)
              return res.status(500).json({
                success: false,
                message:
                  'Could not add the smartbox to the already created site',
                error
              })
            }

            if (cameras.length > 0) {
              // Add cameras of the SmartBox
              cameras.map(camera => {
                const filename = base64Img.imgSync(
                  camera.photo,
                  'static/uploads',
                  shortid.generate() + Date.now()
                )
                new Stream({
                  id: camera.id,
                  name: camera.name,
                  company,
                  site: site._id,
                  photo: '/' + filename
                }).save()
              })
            }

            // Add the new site to the specified subzone
            return res.status(200).json({ site })
          })
        })
      })
    })
  })
})

router.route('/smartbox/exception').post((req, res) => {
  const { id, description } = req.body
  if (!id || !description) return res.status(400).json({})
  SmartBox.findOneAndUpdate(
    { id },
    { $push: { exceptions: { description } } }
  ).exec(error => {
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: false, message: 'Could not save exception' })
    }
    return res
      .status(200)
      .json({ success: true, message: 'Succesfully added exception' })
  })
})

router.route('/smartbox/upgrade/:key').get((req, res) => {
  const { key } = req.params

  Site.findOne({ key }).exec((error, smartbox) => {
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: false, message: 'Could not find Smart Box' })
    }

    if (!smartbox) return res
        .status(404)
        .json({ success: false, message: 'Specified Smartbox was not found' })

    global.io.to(key).emit('upgrade')
    return res.status(200).json({
      success: true,
      message: 'Initialized Smartbox debugging process',
      smartbox
    })
  })
})

router.route('/smartbox/debug/:key').get((req, res) => {
  const { key } = req.params

  Site.findOne({ key }).exec((error, smartbox) => {
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: false, message: 'Could not find Smart Box' })
    }

    if (!smartbox) return res
        .status(404)
        .json({ success: false, message: 'Specified Smartbox was not found' })

    global.io.to(key).emit('debug')
    return res.status(200).json({
      success: true,
      message: 'Initialized Smartbox debugging process',
      smartbox
    })
  })
})

// post Smartbox debug
router.route('/smartbox/debug').post(upload, (req, res) => {
  const { id } = req.body
  const photoFiles = req.files.photos
  console.log(req.files)
  const photos = []

  if (!photoFiles) return res
      .status(400)
      .json({ success: false, message: 'Malformed request. Empty photos' })

  photoFiles.forEach(photo => {
    photos.push(photo.filename)
  })

  SmartBox.findOneAndUpdate(
    { id },
    { $push: { debugs: { photos } } },
    { $set: { debugs: { logFile: req.files.log[0] } } }
  ).exec(error => {
    if (error) {
      winston.error(error)
      return res.status(500).json({
        success: false,
        message: "The specified debug couldn't be created"
      })
    }

    return res
      .status(200)
      .json({ success: true, message: 'Succesfully debugged Smartbox' })
  })
})

router.route('/sites/sensors').put((req, res) => {
  let { sensors } = req.body
  const { key, company } = req.body
  if (!key || !company || !sensors) return res
      .status(400)
      .json({ success: false, message: 'Malformed request' })

  console.log('Antes', sensors)
  // Parse JSON format from Python
  if (typeof sensors === 'string') sensors = JSON.parse(sensors)
  console.log('Despues', sensors)
  // Since is not human to check which company ObjectId wants to be used, a search based on the name is done
  Company.findOne({ name: company }).exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res
        .status(404)
        .json({ success: false, message: 'Specified company was not found' })

    // Find and update site with new information
    Site.findOne({ company, key }).exec((error, site) => {
      if (error) {
        winston.error({ error })
        return res.status(500).json({ error })
      }

      if (!site) return res
          .status(404)
          .json({ success: false, message: 'No site found' })

      // Generate alarms based on sensors values
      sensors.map(sensor => {
        switch (sensor.class) {
          case 'contact':
            if (sensor.value === 0) {
              const alarm = {
                event: 'Alerta de apertura',
                status: 'Sensor abierto',
                risk: 3
              }
              site.alarms.push(alarm)
            }
            break
          case 'vibration':
            if (sensor.value === 0) {
              const alarm = {
                event: 'Alerta de vibración',
                status: 'Sensor activado',
                risk: 2
              }
              site.alarms.push(alarm)
            }
            break
          case 'temperature':
            if (sensor.value < 5) {
              const alarm = {
                event: 'Alerta de temperatura',
                status: 'Temperatura baja',
                risk: 2
              }
              site.alarms.push(alarm)
            }
            if (sensor.value > 40) {
              const alarm = {
                event: 'Alerta de temperatura',
                status: 'Temperatura alta',
                risk: 1
              }
              site.alarms.push(alarm)
            }
            break
          case 'cpu':
            if (sensor.value > 60) {
              const alarm = {
                event: 'Alerta de temperatura del CPU',
                status: 'Temperatura alta',
                risk: 2
              }
              site.alarms.push(alarm)
            }
            break
          case 'battery':
            if (sensor.value <= 15) {
              const alarm = {
                event: 'Alerta de batería',
                status: 'Bateria baja',
                risk: 2
              }
              site.alarms.push(alarm)
            }
            break
          default:
        }
      })

      // Update sensors
      site.sensors = sensors

      site.save(error => {
        if (error) {
          winston.error({ error })
          return res.status(500).json({ error })
        }

        return res.status(200).json({
          success: true,
          message: 'Updated sensor information sucessfully'
        })
      })
    })
  })
})

// Get all sensors for all company sites
router.route('/sites/sensors').get((req, res) => {
  const company = req._user.cmp

  Site.find({ company })
    .select('sensors key')
    .exec((error, sites) => {
      if (error) {
        winston.error({ error })
        return res.status(500).json({ error })
      }

      if (!sites) return res.status(404).json({ message: 'No sites found' })

      return res.status(200).json({ sites })
    })
})

// Get all sensors for all company hsitory
router.route('/sites/sensors/history').get((req, res) => {
  const company = req._user.cmp
  Site.find({ company })
    .populate('zone', 'name')
    .select('alarms history key zone')
    .exec((error, sites) => {
      if (error) {
        winston.error({ error })
        return res.status(500).json({ error })
      }
      if (!sites) return res.status(404).json({ message: 'No sites found' })
      return res.status(200).json({ sites })
    })
})

// Get all sensors for all company hsitory
router.route('/sites/sensors/dismiss/:key').post((req, res) => {
  const company = req._user.cmp
  const { key } = req.params
  Site.findOneAndUpdate({ company, key }, { $set: { alarms: [] } }).exec(
    (error, sites) => {
      if (error) return res.status(404).json({ message: 'No sites found' })
      return res.status(200).json({ sites })
    }
  )
})

// Get sensors of specific type for all company sites
router.route('/sites/sensors/:type').get((req, res) => {
  const company = req._user.cmp
  const { type } = req.params

  Site.find({ company })
    .select('key sensors')
    .exec((error, sites) => {
      if (error) {
        winston.error({ error })
        return res.status(500).json({ error })
      }

      if (!sites) return res.status(404).json({ message: 'No sites found' })
      const sensors = []
      sites.map(site => {
        site.sensors.map(sensor => {
          sensors.push(sensor)
        })
      })
      return res.status(200).json({ sensors })
    })
})
// deprecated method
// Get sensors of specific type for all company sites
router.route('/sites/alarms/').get((req, res) => {
  const company = req._user.cmp

  Site.find({ company })
    .populate('zone', 'name')
    .select('key zone alarms')
    .exec((error, sites) => {
      if (error) {
        winston.error({ error })
        return res.status(500).json({ error })
      }

      return res.status(200).json({ sites })
    })
})

router.route('/video/token').post((req, res) => {
  const company = req._user.cmp
  const { key, id } = req.body

  Site.findOne({ key }).exec((error, site) => {
    if (error) {
      winston.error({ error })
      return res
        .status(500)
        .json({ success: false, message: 'Could not create streaming', error })
    }
    if (!site) return res
        .status(404)
        .json({ success: false, message: 'Site was not found' })
    // Generate room unique token
    crypto.pseudoRandomBytes(16, (error, raw) => {
      const room = raw.toString('hex') + Date.now()
      Stream.findOneAndUpdate({ id }, { $set: { room } }).exec(
        (error, stream) => {
          if (error) {
            winston.error({ error })
            return res.status(500).json({
              success: false,
              message: 'Could not create streaming',
              error
            })
          }
          const data = { id, room }
          global.io.to(key).emit('streaming', data)

          return res.status(200).json({ room })
        }
      )
    })
  })
})

router.route('/video/cameras').get((req, res) => {
  const company = req._user.cmp

  Stream.find({ company })
    .populate('site', 'key zone')
    .exec((error, cameras) => {
      if (error) {
        winston.error({ error })
        return res
          .status(500)
          .json({ success: false, message: 'Could not retrieve cameras' })
      }
      return res.status(200).json({
        success: true,
        message: 'Retrieved streaming cameras',
        cameras
      })
    })
})

router.route('/visualcounter/count').post((req, res) => {
  let { entries, exits } = req.body
  const start = 83
  const end = 238
  // Parse since code comoes as plain text
  entries = JSON.parse(entries)
  exits = JSON.parse(exits)

  // Slice arrays since we only care for values between 7AM and 7PM
  entries = entries.slice(start, end)
  exits = exits.slice(start, end)

  // Clean arrays from shitty coding
  entries.map((i, index) => {
    if (i === 65535) entries[index] = 0
  })

  exits.map((i, index) => {
    if (i === 65535) exits[index] = 0
  })

  // Sum values for every 12 entries. Will be 1 hour
  const cont = 12
  let sum = 0
  const filteredEntries = []
  const filteredExits = []

  entries.map((entry, index) => {
    sum += entry
    if ((index + 1) % cont === 0) {
      filteredEntries.push(sum)
      sum = 0
    }
  })

  sum = 0
  exits.map((entry, index) => {
    sum += entry
    if ((index + 1) % cont === 0) {
      filteredExits.push(sum)
      sum = 0
    }
  })

  // Save both arrays to Counter
  new Counter({
    inputs: filteredEntries,
    outputs: filteredExits
  }).save((error, counter) => {
    if (error) {
      winston.error({ error })
      return res
        .status(500)
        .json({ success: false, message: 'Could not save counter information' })
    }
    return res.status(200).json({
      success: true,
      message: 'Saved counter information',
      counter
    })
    console.log(res)
  })
})

router.route('/visualcounter/count').get((req, res) => {
  const company = req._user.cmp

  // TODO Counter must be part of a Site
  Counter.find({})
    .sort({ timestamp: -1 })
    .exec((error, counts) => {
      const counter = counts[0]
      const sum = []
      counter.inputs.map((count, index) => {
        sum[index] = count + counter.outputs[index]
      })
      if (error) {
        winston.error({ error })
        return res.status(500).json({
          success: false,
          message: 'Could not retrieve counter information'
        })
      }
      return res.status(200).json({
        success: true,
        message: 'Retrieved streaming cameras',
        counts: sum
      })
    })
})

module.exports = router
