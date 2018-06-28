const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const request = require('request')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')

router.route('/tokens').get((req,res) => {
  var token = jwt.sign({
  "exp": Math.floor(Date.now() / 1000) + (60 * 60),
  "iat": Date.now()
},base64url('mefcwbUTxYZHLa_EalRisajyFZD8dCLHYkcBQ1mWuiA'))
})
