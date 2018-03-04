/* eslint-env node */
const express = require('express')
const path = require('path')
const helmet = require('helmet') // Basic headers protection
const bodyParser = require('body-parser')
const winston = require('winston') // Logger
const hpp = require('hpp')
const request = require('request')
const { exec } = require('child_process')
const app = express()

const v1 = require(path.resolve('router/v1'))

// RTMP Server
const NodeMediaServer = require('node-media-server')

const PORT = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())
app.use(hpp())

// If in development use webpackDevServer
if (process.env.NODE_ENV === 'development') {
  app.use(require(path.resolve('config/webpackDevServer')))
}

// Images and static assets
app.use('/static',
  express.static(path.resolve('static'))
)

// TODO add API
// Resolve API v1
app.use('/v1', v1)

function slackMessage(body) {
  request({
    url: 'https://hooks.slack.com/services/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',
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    json: true,
    body
  })
}

app.post('/webhook', (req, res) => {
  slackMessage({
    text: '*Build started*'
  })

  exec('git pull; yarn; yarn build:prod', (error, stdout, stderr) => {
    if (error) {
      slackMessage({
        text: `*Build errored*\nOutput: ${error}`
      })

      return
    }

    if (stdout) {
      exec('yarn reload:prod')
      slackMessage({
        text: `*Build succeed!*\nYou're awersome`
      })
    }

    if (stderr) {
      slackMessage({
        text: `*Errors and warnings:*\n${stderr}`
      })
    }
  })

  res.status(200).json({ message: 'Webhook recieved' })
})

// Dist bundles
app.use('/dist', express.static('dist'))

// Send index to all other routes
app.get('*', (req, res) =>
  res.sendFile(path.resolve('dist/index.html'))
)

// Start server
app.listen(PORT, () =>
  winston.info(`Connus server is listening on port: ${PORT}!`)
)

// Start RTMP Server
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
}

const nms = new NodeMediaServer(config)
nms.run()
