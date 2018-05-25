/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

const Access = require(path.resolve('models/Access'))

router.route('/access/logs').get((req, res) => {
  // Find all access logs
  Access.find({})
    .sort({ timestamp: -1 })
    .exec((error, accessLogs) => {
      if (error) {
        winston.error(error)
        return res
          .status(500)
          .json({ success: 'false', message: 'Could not retrieve access logs' })
      }

      return res.status(200).json({ success: true, accessLogs })
    })
})

module.exports = router
