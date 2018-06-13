/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

const Counter = require(path.resolve('models/Counter'))

/* VISUAL COUNTER DEVICE POSTS HERE ITS INFORMATION */
router.route('/counter/count').post((req, res) => {
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
  entries.map(($0, index) => {
    if ($0 === 65535) entries[index] = 0
  })

  exits.map(($0, index) => {
    if ($0 === 65535) exits[index] = 0
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
  })
})

/* GET COUNTER INFORMATION */
router.route('/counter/count').get((req, res) => {
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
