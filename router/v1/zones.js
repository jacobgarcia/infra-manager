/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

const Zone = require(path.resolve('models/Zone'))

/* CREATE NEW ZONE USING AN ARRAY OF POSITIONS */
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

/* GET ZONES, SUBZONES AND SITES */
router.route('/zones/exhaustive').get((req, res) => {
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

module.exports = router
