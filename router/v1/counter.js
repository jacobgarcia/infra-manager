/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

const Site = require(path.resolve('models/Site'))
const Company = require(path.resolve('models/Company'))

/* VISUAL COUNTER DEVICE POSTS HERE ITS INFORMATION */
router
  .route('/counter/count')
  .post((req, res) => {
    const { key, company } = req.body
    let { entries, exits } = req.body
    const start = 83 // 7:00AM
    const end = 238 // 7:00PM
    // Parse since code comes as plain text
    entries = JSON.parse(entries)
    exits = JSON.parse(exits)

    // Slice arrays since we only care for values between 7AM and 7PM
    entries = entries.slice(start, end)
    exits = exits.slice(start, end)

    // Clean arrays from shitty coding. That means remove 65535 when no count has take place
    entries.map(($0, index) => {
      if ($0 === 65535) entries[index] = 0
    })

    exits.map(($0, index) => {
      if ($0 === 65535) exits[index] = 0
    })

    // Sum values for every 12 entries. This will be 1 hour
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

    // Sum values for every 12 exits. This will be 1 hour
    sum = 0
    exits.map((entry, index) => {
      sum += entry
      if ((index + 1) % cont === 0) {
        filteredExits.push(sum)
        sum = 0
      }
    })

    Company.findOne({ name: company }).exec((error, company) => {
      if (error) {
        winston.error({ error })
        return res.status(500).json({
          success: false,
          message: 'Could not retrieve company'
        })
      }

      if (!company) return res.status(404).json({ success: false, message: 'Company was not found' })
      const counter = {
        inputs: filteredEntries,
        outputs: filteredExits
      }
      // Save both arrays to Counter
      return Site.findOneAndUpdate({ company, key }, { $push: { counter } })
        .select('id')
        .exec(error => {
          if (error) {
            winston.error({ error })
            return res.status(500).json({
              success: false,
              message: 'Could not update site with counter information'
            })
          }
          return res.status(200).json({
            success: true,
            message: 'Saved counter information',
            counter
          })
        })
    })
  })

  /* GET COUNTER INFORMATION */
  .get((req, res) => {
    const company = req._user.cmp
    const sum = []

    Site.find({ company })
      .select('counter')
      .exec((error, sites) => {
        if (error) {
          winston.error({ error })
          return res.status(500).json({
            success: false,
            message: 'Could not retrieve counter information'
          })
        }
        sites.map(site => {
          // Sort counters by timestamp
          site.counter.sort(($0, $1) => {
            return $0.timestamp - $1.timestamp
          })
          const counter = site.counter[0] // Get the lastest entries
          // Sum inputs and outputs
          if (counter) {
            counter.inputs.map((count, index) => {
              sum[index] = count + counter.outputs[index]
            })
          }
        })
        return res.status(200).json({
          success: true,
          message: 'Retrieved streaming cameras',
          counts: sum
        })
      })
  })

module.exports = router
