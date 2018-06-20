/* eslint-env node */
const express = require('express')
const path = require('path')
const router = new express.Router()
require(path.resolve('models/Company'))

// Authenticate before any possible request
router.use(require(path.resolve('router/v1/auth')))

// The next things will be protected by auth
router.use(require(path.resolve('router/v1/access')))
router.use(require(path.resolve('router/v1/admins')))
router.use(require(path.resolve('router/v1/alerts')))
router.use(require(path.resolve('router/v1/cameras')))
router.use(require(path.resolve('router/v1/debugs')))
router.use(require(path.resolve('router/v1/polygons')))
router.use(require(path.resolve('router/v1/sites')))
router.use(require(path.resolve('router/v1/smartbox')))
router.use(require(path.resolve('router/v1/stats')))
router.use(require(path.resolve('router/v1/users')))
router.use(require(path.resolve('router/v1/vehicular-flow')))
router.use(require(path.resolve('router/v1/video')))
router.use(require(path.resolve('router/v1/zones')))

// TODO: Send user invitee (mail)
// TODO: Accept user invitee

router.use((req, res) => {
  return res.status(400).json({ message: 'No route' })
})

module.exports = router
