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

/* GET A LIST OF ALL SITES REGISTERED TO A SPECFIED COMPANY */
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

/* UPDATE SENSORS AND GENERATE ALARMS IF ITS THE CASE. TODO: REFEACTOR THIS ENDPOINT */
router
  .route('/sites/sensors')
  .put((req, res) => {
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

  /* GET A LIST OF ALL SENSORS FOR ALL SITES FROM A SPECIFIED COMPANY */
  .get((req, res) => {
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
