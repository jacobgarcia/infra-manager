/* eslint-env node */
const express = require('express')
const path = require('path')
const helmet = require('helmet') // Basic headers protection
const bodyParser = require('body-parser')
const winston = require('winston') // Logger
const hpp = require('hpp')
const request = require('request')
const cors = require('cors')
const { exec } = require('child_process')
const app = express()

const v1 = require(path.resolve('router/v1'))

const PORT = process.env.PORT || 8080
const watch = require('node-watch')

app.use(bodyParser.urlencoded({ limit: '12mb' }))
app.use(bodyParser.json({ limit: '12mb' }))
app.use(helmet())
app.use(cors()) /* Enable All CORS Requests */
app.use(hpp())

// Images and static assets
app.use('/static', express.static(path.resolve('static')))

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


// If in development use webpackDevServer
if (process.env.NODE_ENV === 'development') {
  app.use(require(path.resolve('config/webpackDevServer')))
}

// Send index to all other routes
app.get('*', (req, res) =>
  res.sendFile(path.resolve('dist/index.html'))
)

// Start server
const server = app.listen(PORT, () =>
  winston.info(`Connus server is listening on port: ${PORT}!`)
)

// Socket IO Configuration
const io = require('socket.io').listen(server)

io.on('connection', socket => {
  socket.on('join', smartboxId => {
    winston.info('Smartbox ' + smartboxId + ' has joined the dark side')
    socket.join(smartboxId)
  })

  socket.on('disconnect', smartboxId => {
    winston.info('Smartbox ' + smartboxId + ' has disconnected')
  })
})
global.io = io

const watcher = watch('./static/videos/flv', { recursive: true })
let isTimeout = false
let timeOut = null

watcher.on('change', (evt, name) => {
 if (evt === 'update' && !isTimeout) {
  timeOut = setTimeout(videoConverter, 5000, name)
  isTimeout = true
 }
 else {
   clearTimeout(timeOut)
   timeOut = setTimeout(videoConverter, 5000, name)
  }
})

function videoConverter(name) {
    var file = name.split("/")
    var old = file[3]
    var rename = old.split(".flv")
    exec('avconv -i ' + name + ' -codec copy ./static/videos/mp4/' + rename[0] + '.mp4', error => {
        if (error !== null) winston.error('exec error: ' + error)
    })
    isTimeout = false
}
