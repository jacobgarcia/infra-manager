/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const config = require(path.resolve('config/config'))

// const Site = require(path.resolve('models/Site'))
// const Zone = require(path.resolve('models/Zone'))
const Admin = require(path.resolve('models/Admin'))
const Site = require(path.resolve('models/Site'))

router.route('/admins/authenticate').post((req, res) => {
  const { user, password } = req.body

  if (!user) return res.status(400).json({
      success: 'false',
      message: 'Authentication failed. No user specified.'
    })

  Admin.findOne({ user }).exec((error, user) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ success: 'false', message: 'Server Error' })
    } else if (!user) return res.status(401).json({
        success: 'false',
        message: 'Authentication failed. Wrong user or password.'
      })
    else if (!user.comparePassword(password)) return res.status(401).json({
        success: 'false',
        message: 'Authentication failed. Wrong user or password.'
      })

    const token = jwt.sign({ _id: user._id }, config.secret) // expires in 6 hours
    res.status(200).json({
      success: true,
      message: 'Successfully authenticated admin',
      user,
      token
    }) // Return the information as JSON
  })
})

// Register new admin
router.route('/admins/register').post((req, res) => {
  const { user, password, site, role } = req.body
  // Validate that no field is empty
  if (!user || !password || !site || !role) return res
      .status(400)
      .json({ success: false, message: 'Malformed request' })
  if (
    role != 'registrar' &&
    role != 'appointer' &&
    role != 'camarabader' &&
    role != 'root'
  ) return res.status(400).json({
      success: false,
      message: 'Role can only be registrar or appointer'
    })
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

    // Validate against duplicates
    Admin.findOne({ user }, '-password').exec((error, admin) => {
      // if there are any errors, return the error
      if (error) {
        winston.error(error)
        return res
          .status(500)
          .json({ success: 'false', message: 'Error finding that admin.' }) // return shit if a server error occurs
      } else if (admin) return res.status(401).json({
          success: 'false',
          message: 'That user is already registered. Try with another one.'
        })

      new Admin({
        user,
        password: bcrypt.hashSync(password),
        site,
        role
      }).save((error, user) => {
        // Save the user
        if (error) {
          winston.error(error)
          return res
            .status(500)
            .json({ success: 'false', message: 'Could not save user.' })
        }
        // Create a token and --- sign with the user information --- and secret password
        var token = jwt.sign({ _id: user._id }, config.secret, {
          expiresIn: 216000
        }) // Expires in 60 hours
        return res.status(200).json({
          success: true,
          message: 'Successfully registered admin',
          _id: user._id,
          user: user.user,
          token: token
        })
      })
    })
  })
})

module.exports = router
