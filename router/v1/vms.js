const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const request = require('request')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')
const ObjectID = mongo.ObjectID
const crypto = require('crypto')
const uuid = require('uuid/v1')
const Zone = require(path.resolve('models/Zone'))
const Site = require(path.resolve('models/Site'))
const Company = require(path.resolve('models/Company'))
const Stream = require(path.resolve('models/Stream'))

router.route('/stream').post((req,res) => {
  let { core, user, pass, streamid} = req.body
  const { version, company, key, name, country, zone } = req.body

  if (
    !core ||
    !user ||
    !pass ||
    !streamid ||
    !version ||
    !company ||
    !key ||
    !name ||
    !country ||
    !zone
  ) return res
    .status(400)
    .json({ success: false, message: 'Malformed request' })
  return Company.findOne({ name: company }).exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res
        .status(404)
        .json({ success: false, message: 'Specified company was not found' })
    return Zone.findOne({ name: zone, company: company._id }).exec(
      (error, zone) => {
        if (error) {
          winston.error(error)
          return res.status(500).json({ error })
        }
        if (!zone) return res
            .status(404)
            .json({ success: false, message: 'Specified zone was not found' })
        return Site.findOne({ key, company: company._id }).exec(
          (error, site) => {
            if (error) {
              winston.error(error)
              return res.status(500).json({
                success: false,
                message:
                  'Could not find site',
                error
              })
            }
            request.get("http://192.168.1.48/service/trusted/issuer?version=2", {
              'auth': {
                'user': 'admin',
                'pass': 'admin'
              }
            }, (err, res, body) => {
                if (res.statusCode == 200) {
                  return Stream.findOne({ body.id , company: company._id}).exec(
                    (error, stream) => {
                      !stream ? {
                        let issuerkey = { issuerkey: stream.issuerkey }
                        let id = { id: stream.id }
                        return res.status(200).json({ site })
                      } : {
                        return res.status(500).json({
                          success: false,
                          message:
                            'Issuer ocupated, delete first',
                          error
                          })
                      }
                    })
                } else {
                  let id = { id: uuid() }
                  let issuerkey = { issuerkey: base64url(crypto.randomBytes(32)) }
                  request({
                    url: `http://192.168.1.48/service/trusted/issuer?version=2`,
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        },
                    json: {
                    "id": id.id,
                    "access_token": "",
                    "key": {
                      "kty": "oct",
                      "k": issuerkey.issuerkey
                    },
                    "description": "",
                    "uri": ""
                    }
                  },
                  {
                  'auth': {
                    'user': 'admin',
                    'pass': 'admin'
                    }
                  },
                  (err, res, body) => {
                  })
                  return res.status(200).json({ site })
                }            })
            new Stream({
              id,
              core,
              user,
              pass,
              streamid,
              version,
              company,
              site,
              name,
              country,
              issuerkey,
              zone
            }).save()
            return res.status(200).json({ site })
          })
      })
  })
})
.get((req,res) => {
  let { core, user, pass, streamid} = req.body
  const { version, company, key, name, country, zone } = req.body

  if (
    !core ||
    !user ||
    !pass ||
    !streamid ||
    !version ||
    !company ||
    !key ||
    !name ||
    !country ||
    !zone
  ) return res
    .status(400)
    .json({ success: false, message: 'Malformed request' })
  return Company.findOne({ name: company }).exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res
        .status(404)
        .json({ success: false, message: 'Specified company was not found' })
    return Zone.findOne({ name: zone, company: company._id }).exec(
      (error, zone) => {
        if (error) {
          winston.error(error)
          return res.status(500).json({ error })
        }
        if (!zone) return res
            .status(404)
            .json({ success: false, message: 'Specified zone was not found' })
        return Site.findOne({ key, company: company._id }).exec(
          (error, site) => {
            if (error) {
              winston.error(error)
              return res.status(500).json({
                success: false,
                message:
                  'Could not add the smartbox to the already created site',
                error
              })
            }
            new Stream({
              core,
              user,
              pass,
              streamid,
              version,
              company,
              key,
              name,
              country,
              zone
            }).save()
            const token = jwt.sign({
              "exp": Math.floor(Date.now() / 1000) + (60 * 60),
              "iat": Date.now()
            },base64url('mefcwbUTxYZHLa_EalRisajyFZD8dCLHYkcBQ1mWuiA'))
            return res.status(200).json({ site })
          })
      })
  })
})

module.exports = router
