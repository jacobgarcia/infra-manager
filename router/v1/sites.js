/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

// const Site = require(path.resolve('models/Site'))
// const Zone = require(path.resolve('models/Zone'))
const Site = require(path.resolve('models/Site'))
const mongoose = require('mongoose')

router.route('/sites/list')
.get((req, res) => {
  Site.find({})
  .sort({ '_id': 1 })
  .exec((error, sites) => { // if there are any errors, return the error
    if (error) {
      winston.error(error)
      return res.status(500).json({'success': "false", 'message': "Error at finding sites"}) // return shit if a server error occurs
    }
    else if (!sites) return res.status(404).json({'success': "false",'message': "Sites not found"})
    else return res.status(200).json({ 'success': true, 'message': "Successfully retrieved sites", sites })
  })
})


// Register new site
router.route('/sites/register')
.post((req, res) => {
  const { key, name, position, company, zone,subzone } = req.body
  new Site({
        key,
        name,
        position,
        company,
        zone,
        subzone
  })
  .save((error, site) => { // Save the user form
    if (error) {
      winston.error(error)
      return res.status(400).json({'success': "false", 'message': "The specified site couldn't be created",'error':error})
    }
    else return res.status(200).json({ 'success': true, 'message': "Successfully registered site" })
  })
})


module.exports = router
