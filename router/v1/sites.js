/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const multer = require('multer')
const mime = require('mime')
const mongo = require('mongodb')
const ObjectID = mongo.ObjectID

// const Site = require(path.resolve('models/Site'))
const Zone = require(path.resolve('models/Zone'))
const Site = require(path.resolve('models/Site'))
const Company = require(path.resolve('models/Company'))
const SmartBox = require(path.resolve('models/SmartBox'))
const Stream = require(path.resolve('models/Stream'))

const base64Img = require('base64-img')
const shortid = require('shortid')

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

/* GET A LIST OF REPORTS FOR ALL SITES FROM A SPECIFIED COMPANY */
router.route('/sites/reports').get((req, res) => {
  const company = req._user.cmp
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
        alarms: site.alarms,
        history: site.history
      }))

      return res.status(200).json({ reports })
    })
})

/* CREATE SITE BASED ON A CENTRAL EQUIPMENT (THIS ENDPOINT MUST BE CALLED WHEN A NEW SMARTBOX CONNECTS TO THE SERVER */
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

  return Company.findOne({ name: company }).exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res
        .status(404)
        .json({ success: false, message: 'Specified company was not found' })

    // Check if smartbox has been already created
    return new SmartBox({
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
      return Zone.findOne({ name: zone, company: company._id }).exec(
        (error, zone) => {
          if (error) {
            winston.error(error)
            return res.status(500).json({ error })
          }

          if (!zone) return res
              .status(404)
              .json({ success: false, message: 'Specified zone was not found' })
          // Create site using the information in the request body
          return new Site({
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
              return res.status(500).json({
                success: false,
                message: 'Could not create site',
                error
              })
            }
            // Site already registred but smartbox does not. Update the site
            return Site.findOneAndUpdate(
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
                  base64Img.img(
                    camera.photo,
                    'static/uploads',
                    shortid.generate() + Date.now(),
                    (error, photo) => {
                      new Stream({
                        id: camera.id,
                        name: camera.name,
                        company,
                        site: site._id,
                        photo: '/' + photo
                      }).save()
                    }
                  )
                })
              }

              // Add the new site to the specified subzone
              return res.status(200).json({ site })
            })
          })
        }
      )
    })
  })
})

/* UPDATE SENSORS AND GENERATE ALARMS IF ITS THE CASE. TODO: REFEACTOR THIS ENDPOINT */
router.route('/sites/sensors').put((req, res) => {
  let { sensors } = req.body
  const { key, company } = req.body
  if (!key || !company || !sensors) return res
      .status(400)
      .json({ success: false, message: 'Malformed request' })

  // Parse JSON format from Python
  if (typeof sensors === 'string') sensors = JSON.parse(sensors)

  // Since it's not human to check which company ObjectId wants to be used, a search based on the name is done
  return Company.findOne({ name: company }).exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res
        .status(404)
        .json({ success: false, message: 'Specified company was not found' })

    // Find and update site with new information
    return Site.findOne({ company, key }).exec((error, site) => {
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
                _id: new ObjectID(),
                timestamp: Date.now(),
                event: 'Alerta de apertura',
                status: 'Sensor abierto',
                risk: 3,
                site: key
              }
              site.alarms.push(alarm)
              // Send socket asking for media files
              global.io.to(key).emit('alarm', alarm)
              // Emit popup alert socket and add alert to REDUX
              global.io.to('connus').emit('alert', alarm)
            }
            break
          case 'vibration':
            if (sensor.value === 0) {
              const alarm = {
                _id: new ObjectID(),
                timestamp: Date.now(),
                event: 'Alerta de vibración',
                status: 'Sensor activado',
                risk: 2,
                site: key
              }
              site.alarms.push(alarm)
              // Send socket asking for media files
              global.io.to(key).emit('alarm', alarm)
              // Emit popup alert socket and add alert to REDUX
              global.io.to('connus').emit('alert', alarm)
            }
            break
          case 'temperature':
            if (sensor.value < 5) {
              const alarm = {
                _id: new ObjectID(),
                timestamp: Date.now(),
                event: 'Alerta de temperatura',
                status: 'Temperatura baja',
                risk: 2,
                site: key
              }
              site.alarms.push(alarm)
              // Send socket asking for media files
              global.io.to(key).emit('alarm', alarm)
              // Emit popup alert socket and add alert to REDUX
              global.io.to('connus').emit('alert', alarm)
            }
            if (sensor.value > 40) {
              const alarm = {
                _id: new ObjectID(),
                timestamp: Date.now(),
                event: 'Alerta de temperatura',
                status: 'Temperatura alta',
                risk: 1,
                site: key
              }
              site.alarms.push(alarm)
              // Send socket asking for media files
              global.io.to(key).emit('alarm', alarm)
              // Emit popup alert socket and add alert to REDUX
              global.io.to('connus').emit('alert', alarm)
            }
            break
          case 'cpu':
            if (sensor.value > 60) {
              const alarm = {
                _id: new ObjectID(),
                timestamp: Date.now(),
                event: 'Alerta de temperatura del CPU',
                status: 'Temperatura alta',
                risk: 2,
                site: key
              }
              site.alarms.push(alarm)
              // Send socket asking for media files
              global.io.to(key).emit('alarm', alarm)
              // Emit popup alert socket and add alert to REDUX
              global.io.to('connus').emit('alert', alarm)
            }
            break
          case 'battery':
            if (sensor.value <= 15) {
              const alarm = {
                _id: new ObjectID(),
                timestamp: Date.now(),
                event: 'Alerta de batería',
                status: 'Bateria baja',
                risk: 2,
                site: key
              }
              site.alarms.push(alarm)
              // Send socket asking for media files
              global.io.to(key).emit('alarm', alarm)
              // Emit popup alert socket and add alert to REDUX
              global.io.to('connus').emit('alert', alarm)
            }
            break
          default:
        }
      })

      // Update sensors
      site.sensors = sensors

      return site.save(error => {
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

/* ADD PHOTO MEDIA FILES TO THE SPECIFIED ALARM THAT SERVERS AS EVIDENCE */
router.route('/sites/alarms').put(upload, (req, res) => {
  const { key, company, alarm } = req.body
  const photoFiles = req.files.photos
  const photos = []

  console.log(req.files)

  if (!key || !company || !photoFiles) return res
      .status(400)
      .json({ success: false, message: 'Malformed request' })

  // Since it's not human to check which company ObjectId wants to be used, a search based on the name is done
  return Company.findOne({ name: company }).exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res
        .status(404)
        .json({ success: false, message: 'Specified company was not found' })

    // Find and update site with new information
    photoFiles.map(photo => {
      photos.push(photo.filename)
    })

    return Site.findOne({ company, key }).exec((error, site) => {
      if (error) {
        winston.error({ error })
        return res.status(500).json({ error })
      }
      if (!site) return res.status(404).json({ message: 'No sites found' })
      const alarmIndex = site.alarms.findIndex($0 => {
        $0._id === alarm
      })

      // Push photo files to specified alarm
      site.alarms[alarmIndex].photos.push(photos)

      return site.save(error => {
        if (error) {
          winston.error({ error })
          return res.status(500).json({ error })
        }

        return res.status(200).json({
          success: true,
          message: 'Sucessfully pushed photos to the specified alarm'
        })
      })
    })
  })
})

/* GET A LIST OF ALL SENSORS FOR ALL SITES FROM A SPECIFIED COMPANY */
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

module.exports = router
