const express = require('express')
const path = require('path')
const winston = require('winston')
const router = new express.Router()
const request = require('request')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')
const crypto = require('crypto')
const uuid = require('uuid/v1')
const Zone = require(path.resolve('models/Zone'))
const Site = require(path.resolve('models/Site'))
const Company = require(path.resolve('models/Company'))
const Stream = require(path.resolve('models/Stream'))

router.route('/stream').post((req,res) => {
  const { core, user, pass, streamid } = req.body
  const { company, site, name, country, zone } = req.body
  if (
    !core ||
    !user ||
    !pass ||
    !streamid ||
    !company ||
    !site ||
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
        .json({ success: false, message: 'Specified company was not found or is not in DB' })
    return Zone.findOne({ name: zone, company: company._id }).exec(
      (error, zone) => {
        if (error) {
          winston.error(error)
          return res.status(500).json({ error })
        }
        if (!zone) return res
            .status(404)
            .json({ success: false, message: 'Specified zone was not found or is not in DB' })
        return Site.findOne({ name: site, company: company._id, zone: zone._id}).exec(
          (error, site) => {
            let issuerkey = null
            let id = null
            if (error) {
              winston.error(error)
              return res.status(500).json({ error })
            }
            if (!site) return res
              .status(404)
              .json({ success: false, message: 'Could not find site or is not in DB' })
            return request.get("http://192.168.1.48/service/trusted/issuer?version=2", {
                'auth': {
                  'user': 'admin',
                  'pass': 'admin'
                }
              },
              (err, resp, body) => {
                if (err) {
                  return res.status(500).json({
                    success: false,
                    message:
                      'Endpoint error',
                    error
                  })
                }
                switch (resp.statusCode) {
                  case 200:
                    return Stream.findOne({ id: body.id , company: company._id}).exec(
                      (error, stream) => {
                        if (error) {
                          return res.status(500).json({
                            success: false,
                            message:
                              'Stream base data error',
                            error
                            })
                        }
                        if (stream) {
                          issuerkey = { issuerkey: stream.issuerkey }
                          id = { id: stream.id }
                          new Stream({
                            id,
                            core,
                            user,
                            streamid,
                            company: company._id,
                            site: site._id,
                            name,
                            country,
                            issuerkey,
                            zone: zone._id
                          }).save()
                          return res.status(200).json({success: true,
                          message:
                            'Stream Added'})
                          }
                        return res.status(500).json({
                          success: false,
                          message:
                            'Issuer ocupated, delete first',
                          error
                        })
                    })
                  case 404:
                    id = { id: uuid() }
                    issuerkey = { issuerkey: base64url(crypto.randomBytes(32)) }
                    return request({
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
                    (err, response, body) => {
                      if (!err && response.status === 200) {
                        new Stream({
                          id,
                          core,
                          user,
                          streamid,
                          company: company._id,
                          site: site._id,
                          name,
                          country,
                          issuerkey,
                          zone: zone._id
                        }).save()
                        return res.status(200).json(body)
                      }
                      return res.status(404).json(err)
                    })
                  default:
                    return res.status(400).json(body)
                }
              })
          })
      })
  })
})
.get((req,res) => {
  const { company } = req.body
  if (
    !company
  ) return res
    .status(400)
    .json({ success: false, message: 'Malformed request' })
  return Stream.find({ company: company}).exec((error, streams) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    return res.status(200).json(streams)
    })
})

router.route('/stream/token').get((req,res) => {
  const { core } = req.body
  const { company, site, country, zone } = req.body
  if (
    !core ||
    !company ||
    !site ||
    !name ||
    !country ||
    !zone
  ) return res
    .status(400)
    .json({ success: false, message: 'Malformed request' })
  return Stream.findOne({ company: company, site: site, country: country, zone: zone, core }).exec((error, stream) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    const token = jwt.sign({
      "exp": Math.floor(Date.now() / 1000) + (60 * 60),
      "iat": Date.now()
      },base64url(stream.issuerkey))
    return res.status(200).json(token)
    })
})

module.exports = router
