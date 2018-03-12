/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

// const Site = require(path.resolve('models/Site'))
// const Zone = require(path.resolve('models/Zone'))
const mongoose = require('mongoose')
const Battery = require(path.resolve('models/Battery'))
const Site = require(path.resolve('models/Site'))
const Report = require(path.resolve('models/Report'))
const Access = require(path.resolve('models/Access'))
const Face = require(path.resolve('models/Face'))
const base64Img = require('base64-img')
const shortid = require('shortid')


/***** CAMERA LOGS ENDPOINTS ****/
router.route('/cameras/log/battery')
.post((req, res) => {
  const { camera, battery }  = req.body

  new Battery({
    camera,
    battery
  })
  .save((error, log) => { // Save the log
    if (error) {
      winston.error(error)
      return res.status(500).json({'success': "false",'message': "Could not save log."})
    }
    else return res.status(200).json({ 'success': true, log })
  })
})

// Delete already registered users
router.route('/cameras/alarm/photos')
.post((req, res) => {

  const data = {camera,
         photo,
         pc1,
         pc2 } = req.body

  // Emit alert socket
  global.io.to('ATT').emit('photo-alarm', data)

  return res.status(200).json({ 'success': true, 'message': 'Bacan',/*'data':data*/ })
})

/***** CAMERA LOGS ENDPOINTS ****/
router.route('/cameras/log/battery')
.post((req, res) => {
  const { camera, battery }  = req.body

  new Battery({
    camera,
    battery
  })
  .save((error, log) => { // Save the log
    if (error) {
      winston.error(error)
      return res.status(500).json({'success': "false",'message': "Could not save log."})
    }
    else return res.status(200).json({ 'success': true, log })
  })
})

/***** CAMERA LOGS ENDPOINTS ****/
router.route('/cameras/report/clients')
.get((req, res) => {
  //Get all sites to use as rooms
  Site.find({})
  .sort({ 'key': 1 })
  .exec((error, sites) => { // if there are any errors, return the error
    if (error) {
      winston.error(error)
      return res.status(500).json({'success': "false", 'message': "Error at finding sites"}) // return shit if a server error occurs
    }
    else if (!sites) return res.status(404).json({'success': "false",'message': "Sites not found"})
    else {
      let connected_sites = []
      let counter = 0
      sites.forEach((room) => {
        global.io.in(room._id).clients((error, clients) => {
          counter++
          // Just add the rooms who have at least one client
          if (clients != '') connected_sites.push(room._id)
          if (counter === sites.length) return res.status(200).json({'success': true, connected_sites})
        })
      })
    }
  })
})
router.route('/cameras/log/report')
.post((req, res) => {
  const { vibration_one, vibration_two, door_one, door_two, battery, camera_one, camera_two }  = req.body

  new Report({
    vibration_one,
    vibration_two,
    door_one,
    door_two,
    battery,
    camera_one,
    camera_two
  })
  .save((error, log) => { // Save the log
    if (error) {
      winston.error(error)
      return res.status(500).json({'success': "false",'message': "Could not save log."})
    }
    else return res.status(200).json({ 'success': true, log })
  })
})
router.route('/cameras/log/access')
.post((req, res) => {
  const { camera, pin, status, photo }  = req.body

  new Access({
    camera,
    pin,
    status,
    photo
  })
  .save((error, log) => { // Save the log
    if (error) {
      winston.error(error)
      return res.status(500).json({'success': "false",'message': "Could not save log."})
    }
    else return res.status(200).json({ 'success': true, log })
  })
})

// Everytime a face is detected log it
router.route('/cameras/access/facedetection')
.post((req, res) => {
  const { camera, status, photo }  = req.body

  if (!photo) return res.status(400).json({'success': "false", 'message': "Face photo was not sent"})
  else {
    const filename = base64Img.imgSync(photo, 'static/faces', shortid.generate() + Date.now())
    new Face({
        camera,
        status,
        photo: '/' + filename
    })
    .save((error, face) => { // Save the face
      if (error) {
        winston.error(error)
        return res.status(400).json({'success': "false", 'message': "The specified camera does not exist",/*"error":error*/})
      }

      else return res.status(200).json({'success': true, 'message': "Successfully uploaded photo"})
    })
  }
})

module.exports = router
