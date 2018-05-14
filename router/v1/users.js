/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const multer = require('multer')
const mime = require('mime')
const mongoose = require('mongoose')
const nev = require('email-verification')(mongoose)
const jwt = require('jsonwebtoken')
const base64Img = require('base64-img')
const shortid = require('shortid')
const PythonShell = require('python-shell')

// Image optimization
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')

const Guest = require(path.resolve('models/Guest'))
const Site = require(path.resolve('models/Site'))
const User = require(path.resolve('models/User'))
const FrmUser = require(path.resolve('models/FrmUser'))
const Access = require(path.resolve('models/Access'))

const Admin = require(path.resolve('models/Admin'))

const config = require(path.resolve('config/config'))

mongoose.connect(config.database)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/uploads/profile-pictures/')
  },
  filename: (req, file, cb) => {
    cb(null, `${req._user._id}.${mime.getExtension(file.mimetype)}`)
  }
})

const upload = multer({ storage })

// nev.configure({
//   verificationURL: `https://demo.kawlantid.com/signup/${URL}`,
//
//   // mongo configuration
//   persistentUserModel: User,
//   tempUserModel: Guest,
//   expirationTime: 86400, // 24 hour expiration
//   URLFieldName: 'invitation_token',
//
//   transportOptions: {
//     service: 'Gmail',
//     auth: {
//         user: 'ingenieria@connus.mx',
//         pass: 'kawlantcloud'
//     }
//   },
//   verifyMailOptions: {
//       from: 'Do Not Reply <ingenieria@connus.mx>',
//       subject: 'Confirm your account',
//       html: `<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ` +
//               `paste the following link into your browser:</p><p>${URL}</p>`,
//       text: `Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}`
//   },
//   shouldSendConfirmation: true,
//   confirmMailOptions: {
//       from: 'Do Not Reply <ingenieria@connus.mx>',
//       subject: 'Successfully verified!',
//       html: '<p>Your account has been successfully verified.</p>',
//       text: 'Your account has been successfully verified.'
//   },
//
//   hashingFunction: null
// })

/** ***********************************
 ***                                ***
 ***          MIDDLEWARE JWT        ***
 ***                                ***
 *************************************/
/* This endpoints are secured so you need a token in order to use 'em */
// router.use((req, res, next) => {
//  res.header("Access-Control-Allow-Origin", "*")
//  res.header("Access-Control-Allow-Headers", "X-Requested-With")
//  const token = req.headers['x-access-token'] // check header or url parameters or post parameters for token
//
//  if (token) {
//    const decodedToken = jwt.decode(token) //Decode token
//    jwt.verify(token, config.secret, (error, decoded) => { // decode token
//      if (error) return res.status(401).json({'success': false, 'message': 'Failed to authenticate token.'})
//      else { //Send the decoded token to the request body
//        req.U_ID = decoded._id //Save the decoded user_id from the token to use in next routes
//        next()
//      }
//    })
//  }
//  else return res.status(403).json({'success': "false",'message': "No token provided"});
// })

router.route('/users/invite').post((req, res) => {
  const { email, company, host } = req.body

  const guest = new User({
    email,
    company,
    host
  })

  nev.createTempUser(guest, (err, existingPersistentUser, newTempUser) => {
    if (err) {
      winston.error({ err })
      return res.status(500).json({ err })
    }
    if (existingPersistentUser) return res.status(409).json({ error: 'User already registered' })

    if (newTempUser) {
      const URL = newTempUser[nev.options.URLFieldName]
      nev.sendVerificationEmail(email, URL, error => {
        if (error) return res.status(500).json({ error })
        return res.status(200).json({ message: 'Invitation successfully sent' })
      })
    }
    // user already have been invited
    return res.status(409).json({ error: 'User already invited' })
  })
})

// Recognize user based on photo
router.route('/users/recognize').post((req, res) => {
  const { pin, photo, event } = req.body

  FrmUser.findOne({ pin }).exec((error, user) => {
    // if there are any errors, return the error
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: 'false', message: 'Error at finding users' }) // return shit if a server error occurs
    } else if (!user) return res
        .status(401)
        .json({ success: 'false', message: 'That user is not registered' })
    else if (!photo) return res
        .status(400)
        .json({ success: 'false', message: 'Image not specified' })

    // decode base64 image
    const filename = base64Img.imgSync(
      photo,
      'static/uploads',
      shortid.generate() + Date.now()
    )

    // call code for AWS facial recognition. Now using stub
    // use PythonShell to call python instance
    const faceRecognition = new PythonShell('lib/python/rekognition.py', {
      pythonOptions: ['-u'],
      args: ['get', pin, process.env.PWD + '/' + filename]
    })

    /* Wait for the AWS response from Python to proceed */
    faceRecognition.on('message', message => {
      // end the input stream and allow the process to exit
      faceRecognition.end(error => {
        if (error) {
          winston.error(error)
          return res
            .status(500)
            .json({ success: 'false', message: 'Face Recognition Failed' })
        }

        const response = JSON.parse(message)

        // if response was successful, change user logged state
        if (response.validation === 'true') {
          if (event === 'login') user.isLogged = true
          if (event === 'outlog') user.isLogged = false
          user.save((error, updatedUser) => {
            if (error) {
              winston.error(error)
              return res.status(500).json({
                success: 'false',
                message: 'Cannot update user state'
              })
            }
          })
        }
        const data = {
          success: response.validation !== 'false',
          message:
            response.validation === 'false'
              ? 'No se pudo registrar acceso'
              : 'Acceso registrado correctamente',
          pin,
          photo
        }
        console.log(event)
        global.io.to('ATT').emit(event, data)
        global.io.to('connus').emit(event, data)

        // Insert access
        new Access({
          timestamp: new Date(),
          event:
            data.success === true
              ? event === 'login'
                ? 'Inicio de sesión exitoso'
                : 'Cierre de sesión exitoso'
              : event === 'login'
                ? 'Intento de inicio de sesión'
                : 'Intento de cierre de sesión',
          success: data.success,
          risk: data.success ? 0 : 2,
          zone: {
            name: 'Centro'
          },
          status:
            data.success === true
              ? event === 'login'
                ? 'Acceso autorizado. Sensorización desactivada'
                : 'Acceso autorizado. Sensorización reactivada'
              : 'Acceso denegado. Rostro desconocido almacenando',
          site: user.site,
          access: event === 'login' ? 'Inicio de sesión' : 'Cierre de sesión',
          pin: data.pin,
          photo: '/' + filename
        }).save((error, access) => {
          if (error) {
            winston.error(error)
            return res
              .status(500)
              .json({ success: 'false', message: 'Could not save log.' })
          }
          return res.status(response.status).json({
            facial_validation: response.validation,
            message: response.description,
            user
          })
        })
      })
    })
  })
})

router.route('/users/self').get((req, res) => {
  User.findById(req._user._id)
    .select({ password: 0 })
    .populate('company', '_id logo name services')
    .exec((error, user) => {
      if (error) {
        winston.error(error)
        return res.status(500).json({ error })
      }

      if (!user) return res.status(404).json({ error: { message: 'User not found' } })
      return res.status(200).json({ user })
    })
})

router.route('/users/self/photo').post(upload.single('photo'), (req, res) => {
  if (!req.file) return res
      .status(400)
      .json({ error: { message: 'Could not get file info' } })

  const imagePath = `/static/uploads/profile-pictures/${req.file.filename}`
  return imagemin([imagePath], 'static/uploads', {
    plugins: [imageminMozjpeg(), imageminPngquant({ quality: '70-80' })]
  })
    .then(() => {
      return User.findByIdAndUpdate(req._user._id, {
        $set: { photoUrl: imagePath }
      })
    })
    .then(() => {
      return res.status(201).json({
        message: 'Uploaded and saved, could not compress',
        photo: imagePath
      })
    })
    .catch(() => {
      return res.status(201).json({
        message: 'Uploaded and saved, could not compress',
        photo: imagePath
      })
    })
})

// Specify comparison from the GUI to the PI
router.route('/users/login').post((req, res) => {
  const { pin, site } = req.body
  // Validate that no field is empty
  if (!pin || !site) return res
      .status(400)
      .json({ success: false, message: 'Malformed request' })
  // Validate that site exists (dumb validation)
  Site.findOne({ key: site }).exec((error, thesite) => {
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: 'false', message: 'Error finding that user.' }) // return shit if a server error occurs
    }
    if (!thesite) return res
        .status(406)
        .json({ success: false, message: 'The specified site does not exist' })

    FrmUser.findOne({ pin }).exec((error, user) => {
      // if there are any errors, return the error
      if (error) {
        winston.error(error)
        return res
          .status(500)
          .json({ success: 'false', message: 'Error at finding users' }) // return shit if a server error occurs
      } else if (!user) return res
          .status(401)
          .json({ success: 'false', message: 'That user is not registered' })
      else if (user.isLogged) return res
          .status(405)
          .json({ success: false, message: 'Already in an active session' })

      global.io.to(site).emit('recognize', user.pin, 'login')
      return res.status(200).json({
        success: true,
        message:
          'The camera is ready to recognize the user. Now take the picture',
        user
      })
    })
  })
})

// Register new user form
router.route('/users/signup').post((req, res) => {
  // Validate that no field is empty
  const { pin, privacy, site } = req.body
  if (!pin || !privacy || !site) return res
      .status(400)
      .json({ success: false, message: 'Malformed request' })
  // Validate that site exists (dumb validation)
  Site.findOne({ key: site }).exec((error, thesite) => {
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: false, message: 'Error finding that site.', error }) // return shit if a server error occurs
    }
    if (!thesite) return res
        .status(406)
        .json({ success: false, message: 'The specified site does not exist' })

    // Check that the user is not already registered. Can be done via mongo but PATY GFYf
    FrmUser.findOne({ pin }).exec((error, user) => {
      if (error) {
        winston.error(error)
        return res.status(400).json({
          success: 'false',
          message: 'The specified frmuser does not exist'
        })
      }
      if (user) return res
          .status(409)
          .json({ success: false, message: 'User already registered' })

      new FrmUser({
        privacy,
        pin,
        site
      }).save((error, user) => {
        // Save the user form
        if (error) {
          winston.error(error)
          return res.status(400).json({
            success: 'false',
            message: 'The specified user is already registered'
          })
        }
        global.io.to(site).emit('register', user.pin)
        return res.status(200).json({
          success: true,
          message:
            "Successfully registered user. Now it's time to take the picture!",
          user
        })
      })
    })
  })
})

// Specify logout comparison from the GUI to the PI
router.route('/users/logout').post((req, res) => {
  const { pin, site } = req.body
  // Validate that no field is empty
  if (!pin || !site) return res
      .status(400)
      .json({ success: false, message: 'Malformed request' })
  // Validate that site exists (dumb validation)
  Site.findOne({ key: site }).exec((error, thesite) => {
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: 'false', message: 'Error finding that admin.' }) // return shit if a server error occurs
    }
    if (!thesite) return res
        .status(406)
        .json({ success: false, message: 'The specified site does not exist' })

    FrmUser.findOne({ pin }).exec((error, user) => {
      // if there are any errors, return the error
      if (error) {
        winston.error(error)
        return res
          .status(500)
          .json({ success: 'false', message: 'Error at finding users' }) // return shit if a server error occurs
      } else if (!user) return res
          .status(401)
          .json({ success: 'false', message: 'That user is not registered' })
      else if (!user.isLogged) return res.status(405).json({
          success: false,
          message: 'The user is not in an active session'
        })

      global.io.to(site).emit('logout', user.pin, 'outlog')
      return res.status(200).json({
        success: true,
        message:
          'The camera is ready to recognize the user. Now take the picture',
        user
      })
      // const data = { status: response.validation, pin }
      // global.io.emit('logout', data)
      // return res.status(200).json({ 'success': true, 'message': "The camera is ready to recognize the user. Now take the picture", updatedUser })
    })
  })
})

// Specify photo update to already registered user
router.route('/users/update').put((req, res) => {
  const { pin, privacy, site } = req.body
  // Validate that no field is empty
  if (!pin || !privacy || !site) return res
      .status(400)
      .json({ success: false, message: 'Malformed request' })
  // Validate that site exists (dumb validation)
  Site.findOne({ key: site }).exec((error, thesite) => {
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: 'false', message: 'Error finding site' }) // return shit if a server error occurs
    }
    if (!thesite) return res
        .status(406)
        .json({ success: false, message: 'The specified site does not exist' })

    // Validate that admin has permissions to register new users
    Admin.findOne({ _id: req.U_ID }).exec((error, admin) => {
      if (error) {
        winston.error(error)
        return res.status(400).json({
          success: 'false',
          message: 'The specified admin does not exist'
        })
      } else if (admin.role != 'registrar' && admin.role != 'camarabader') return res.status(401).json({
          success: false,
          message: "Don't have permission to register new users"
        })

      // Validate that specified user exists
      FrmUser.findOne({ pin }).exec((error, user) => {
        // if there are any errors, return the error
        if (error) {
          winston.error(error)
          return res
            .status(500)
            .json({ success: 'false', message: 'Error at finding users' }) // return shit if a server error occurs
        } else if (!user) return res.status(401).json({
            success: 'false',
            message: 'That user is not registered'
          })

        global.io.to(site).emit('update', user.pin)
        return res.status(200).json({
          success: true,
          message:
            'The camera is ready to update the photo of the user. Now take the picture',
          user
        })
      })
    })
  })
})

router.route('/users/photo').put((req, res) => {
  console.log(req.body)
  // console.log(req.headers)
  const { pin, photo } = req.body
  if (!photo) return res
      .status(400)
      .json({ success: 'false', message: 'Image not found' })

  // no image found
  const filename = base64Img.imgSync(
    photo,
    'static/uploads',
    shortid.generate() + Date.now()
  )
  // Set photo file to new user registered
  FrmUser.findOneAndUpdate(
    { pin },
    { $set: { photo: '/' + filename } },
    { new: true }
  ).exec((error, user) => {
    if (error) {
      winston.error(error)
      return res.status(400).json({
        success: 'false',
        message: 'The specified frmuser does not exist',
        error: error
      })
    } else if (!user) return res.status(404).json({
        success: false,
        message: 'The specified user does not exist'
      })

    // call code for AWS facial recognition. Now using stub
    // use PythonShell to call python instance

    const faceRecognition = new PythonShell('lib/python/rekognition.py', {
      pythonOptions: ['-u'],
      args: ['post', user.pin, process.env.PWD + user.photo]
    })

    /* Wait for the AWS response from Python to proceed */
    faceRecognition.on('message', message => {
      // end the input stream and allow the process to exit
      faceRecognition.end(error => {
        if (error) {
          winston.error(error)
          return res.status(500).json({
            success: 'false',
            message: 'Face Recognition Module Failed'
          })
        }
        const response = JSON.parse(message)

        const data = {
          success: response.validation !== 'false',
          photo,
          pin,
          site: user.site
        }
        // Send photo to ATT and Connus
        global.io.to('ATT').emit('photo', data)
        global.io.to('connus').emit('photo', data)

        // Insert access
        new Access({
          timestamp: new Date(),
          event: data.success
            ? 'Registro de personal exitoso'
            : 'Intento de registro de personal',
          success: data.success,
          risk: data.success ? 0 : 1,
          zone: {
            name: 'Centro'
          },
          status: data.success
            ? 'Registro satisfactorio'
            : 'Regsitro denegado. Fallo en la detección de rostro',
          site: user.site,
          access: 'Registro',
          pin: data.pin,
          photo: user.photo
        }).save((error, access) => {
          if (error) {
            winston.error(error)
            return res
              .status(500)
              .json({ success: 'false', message: 'Could not save log.' })
          }
          return res.status(response.status).json({
            success: response.validation,
            message: response.description,
            user
          })
        })
      })
    })
  })
})

// update user register photo
router.route('/users/updatephoto').put((req, res) => {
  const { pin, photo } = req.body
  if (!photo) return res
      .status(400)
      .json({ success: 'false', message: 'Image not found' })

  // no image found
  // Send photo to GUI
  const data = { photo, pin }
  global.io.to('ATT').emit('photo', data)
  const filename = base64Img.imgSync(
    photo,
    'static/uploads',
    shortid.generate() + Date.now()
  )
  // Set photo file to new user registered
  FrmUser.findOneAndUpdate(
    { pin },
    { $set: { photo: '/' + filename } },
    { new: true }
  ).exec((error, user) => {
    if (error) {
      winston.error(error)
      return res.status(400).json({
        success: 'false',
        message: 'The specified site does not exist'
      })
    } else if (!user) return res.status(404).json({
        success: false,
        message: 'The specified user does not exist'
      })

    // call code for AWS facial recognition. Now using stub
    // use PythonShell to call python instance
    const faceRecognition = new PythonShell('lib/python/rekognition.py', {
      pythonOptions: ['-u'],
      args: ['put', user.pin, process.env.PWD + user.photo]
    })

    /* Wait for the AWS response from Python to proceed */
    faceRecognition.on('message', message => {
      // end the input stream and allow the process to exit
      faceRecognition.end(error => {
        if (error) {
          winston.error(error)
          return res.status(500).json({
            success: 'false',
            message: 'Face Recognition Module Failed'
          })
        }

        const response = JSON.parse(message)

        return res.status(response.status).json({
          success: response.validation,
          message: response.description,
          user
        })
      })
    })
  })
})

// Register appointment for specified user
router.route('/users/appointments').put((req, res) => {
  const { pin, site, startdate, enddate } = req.body
  // Validate that no field is empty
  if (!pin || !site || !startdate || !enddate || enddate < startdate) return res
      .status(400)
      .json({ success: false, message: 'Malformed request' })
  // Validate that site exists (dumb validation)
  Site.findOne({ key: site }).exec((error, thesite) => {
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: 'false', message: 'Error finding site' }) // return shit if a server error occurs
    }
    if (!thesite) return res
        .status(406)
        .json({ success: false, message: 'The specified site does not exist' })

    Admin.findOne({ _id: req.U_ID }).exec((error, admin) => {
      if (error) {
        winston.error(error)
        return res.status(400).json({
          success: 'false',
          message: 'The specified site does not exist'
        })
      } else if (admin.role != 'appointer' && admin.role != 'camarabader') return res.status(401).json({
          success: false,
          message: "Don't have permission to make appointments"
        })

      FrmUser.findOne({ pin }).exec((error, user) => {
        // if there are any errors, return the error
        if (error) {
          winston.error(error)
          return res
            .status(500)
            .json({ success: 'false', message: 'Error at finding users' }) // return shit if a server error occurs
        } else if (!user) return res.status(401).json({
            success: 'false',
            message: 'User not found. Try with another one'
          })

        FrmUser.findOneAndUpdate(
          { _id: user },
          { $set: { site, startdate, enddate } },
          { new: true }
        ).exec((error, user) => {
          if (error) {
            winston.eror(error)
            return res.status(400).json({
              success: 'false',
              message: 'The specified site does not exist'
            })
          }
          // Send appointments to the camera
          request.get(
            {
              url: 'http://localhost:8080/v1/users/appointments/' + site,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': req.headers['x-access-token']
              }
            },
            (error, response) => {
              if (error) {
                winston.info(error)
                return res.status(500).json({
                  success: 'false',
                  message: 'Error at finding appointments'
                })
              }
              global.io.to(site).emit('appointments', response)
              return res.status(200).json({
                success: true,
                message: 'Successfully registered appointment',
                user
              })
            }
          )
        })
      })
    })
  })
})

// Get new appointments
router.route('/users/appointments/:site').get((req, res) => {
  // Get appointments only for specified site
  const site = req.params.site

  FrmUser.find({ enddate: { $gte: Date.now() }, site }).exec((error, users) => {
    // if there are any errors, return the error
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: 'false', message: 'Error at finding appointments' }) // return shit if a server error occurs
    } else if (users.length === 0) return res
        .status(404)
        .json({ success: 'false', message: 'No appointments' })
    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved appointments',
      users
    })
  })
})

// Delete already registered users
router.route('/users/').delete((req, res) => {
  const { pin } = req.body

  FrmUser.remove({ pin }).exec((error, user) => {
    // if there are any errors, return the error
    if (error) {
      winston.error(error)
      return res
        .status(500)
        .json({ success: 'false', message: 'Error at removing user' }) // return shit if a server error occurs
    }
    // call code for AWS facial recognition. Now using stub
    // use PythonShell to call python instance
    const faceRecognition = new PythonShell('lib/python/rekognition.py', {
      pythonOptions: ['-u'],
      args: ['del', pin, process.env.PWD + user.photo]
    })

    /* Wait for the AWS response from Python to proceed */
    faceRecognition.on('message', message => {
      // end the input stream and allow the process to exit
      faceRecognition.end(error => {
        if (error) {
          winston.error(error)
          return res
            .status(500)
            .json({ success: 'false', message: 'FRM Script Failed' })
        }
        const response = JSON.parse(message)

        return res.status(response.status).json({
          success: response.validation,
          message: response.description,
          user
        })
      })
    })
  })
})

module.exports = router
