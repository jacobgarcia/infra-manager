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
const Buffer = require('buffer').Buffer

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
  return Company.findOne({ _id: company }).exec((error, company) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    if (!company) return res
        .status(404)
        .json({ success: false, message: 'Specified company was not found or is not in DB' })
    return Zone.findOne({ _id: zone, company: company._id }).exec(
      (error, zone) => {
        if (error) {
          winston.error(error)
          return res.status(500).json({ error })
        }
        if (!zone) return res
            .status(404)
            .json({ success: false, message: 'Specified zone was not found or is not in DB' })
        return Site.findOne({ key: site, company: company._id, zone: zone._id}).exec(
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
            return request.get(`${core}/service/trusted/issuer?version=2`, {
                'auth': {
                  'user': user,
                  'pass': pass
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
                    return Stream.findOne({ id: JSON.parse(body).id , company: company._id}).exec(
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
                            id: id.id,
                            core,
                            user,
                            streamid,
                            company: company._id,
                            site: site._id,
                            name,
                            country,
                            issuerkey: issuerkey.issuerkey,
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
                    return request
                        .post(`${core}/service/trusted/issuer?version=2`, {
                      'auth': {
                        'user': 'admin',
                        'pass': 'admin'
                      },
                      'headers': {
                        "content-type": "application/json"
                      },
                      'json': {
                        "id": id.id,
                      "access_token": "",
                      "key": {
                        "kty": "oct",
                        "k": issuerkey.issuerkey
                      },
                      "description": "",
                      "uri": ""
                      }
                    }, (err, response, body) => {
                      if (err) {
                        return res.status(500).json({
                            success: false,
                            message:
                              'core endpoint error',
                            error
                        })
                      }
                      if (response.statusCode === 201) {
                        new Stream({
                          id: id.id,
                          core,
                          user,
                          streamid,
                          company: company._id,
                          site: site._id,
                          name,
                          country,
                          issuerkey: issuerkey.issuerkey,
                          zone: zone._id
                        }).save()
                        return res.status(200).json(body)
                      }
                      console.log(response)
                      return res.status(404).json(err)
                    })
                  case 401:
                    return res.status(401).json("usuario o contraseña incorrecta")
                  default:
                    return res.status(400).json(body)
                }
              })
          })
      })
  })
})
.get((req,res) => {
  return Stream.find({ company: req._user.cmp}).exec((error, streams) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    return res.status(200).json(streams)
    })
})

router.route('/stream/token/:id').get((req,res) => {
  const { id } = req.params
  if (
    !id
  ) return res
    .status(400)
    .json({ success: false, message: 'Malformed request' })
  return Stream.findOne({ id: id }).exec((error, stream) => {
    if (error) {
      winston.error(error)
      return res.status(500).json({ error })
    }
    const token = jwt.sign({
      "exp": Math.floor(Date.now() / 1000) + (60 * 60),
      "iat": Math.floor(Date.now() / 1000)
    }, Buffer.from(stream.issuerkey, 'base64'))
    return res.status(200).json(token)
    })
})

module.exports = router
