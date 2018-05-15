/* eslint-env node */
const express = require('express')
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const winston = require('winston')
const hpp = require('hpp')
const cors = require('cors')
const app = express()

const webhook = require(path.resolve('lib/webhook'))
const v1 = require(path.resolve('router/v1'))

const { PORT = 8080, NODE_ENV: mode } = process.env

app.use(bodyParser.urlencoded({ limit: '12mb', extended: true }))
app.use(bodyParser.json({ limit: '12mb' }))
app.use(helmet())
app.use(cors())
app.use(hpp())

app.use('/static', express.static(path.resolve('static')))
app.use('/v1', v1)
app.use(webhook)
app.use(express.static('dist'))

// Check if we're in development mode to use webpackDevServer middleware
if (mode === 'development') {
  app.use(require(path.resolve('config/webpackDevServer')))
}

// Send index to all other routes
app.get('*', (req, res) => res.sendFile(path.resolve('dist/index.html')))

// Start server
const server = app.listen(PORT, () =>
  winston.info(`Connus server is listening on port: ${PORT}!`)
)

const io = require('socket.io').listen(server)

io.on('connection', socket => {
  winston.info('New client connection')
  socket.on('join', companyId => {
    winston.info('New join on room: ' + companyId)
    socket.join(companyId)
    // Emit a refresh to web platform when new camera is connected
    io.to('web-platform').emit('refresh')
  })

  socket.on('disconnect', () => {
    winston.info('Disconnected client')
    // TODO Emit a refresh to web platform
    io.to('web-platform').emit('refresh')
  })
})

global.io = io

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
