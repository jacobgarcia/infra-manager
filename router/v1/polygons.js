/* eslint-env node */
const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()

const State = require(path.resolve('models/State'))

router.route('/polygons/:stateId')
.get((req, res) => {
  const { stateId } = req.params

  State.findById(stateId)
  .exec((error, state) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!state) return res.status(404).json({ message: 'No state found'})

    return res.status(200).json({ state })
  })
})

router.route('/polygons')
.get((req, res) => {
  // TODO: Country
  State.aggregate([
    {$group: { _id: '$country', states: { $push: { name: '$name', _id: '$_id', code: '$code' } } }}
  ])
  .exec((error, states) => {
    if (error) {
      winston.error({error})
      return res.status(500).json({ error })
    }

    if (!states) return res.status(404).json({ message: 'No state found'})

    return res.status(200).json({ states })
  })
})

module.exports = router
