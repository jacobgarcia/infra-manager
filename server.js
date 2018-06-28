/* eslint-env node */
const express = require('express')
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const winston = require('winston')
const hpp = require('hpp')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

const { databaseUri, project: { name } } = require(path.resolve('config'))
const webhook = require(path.resolve('lib/webhook'))
const v1 = require(path.resolve('router/v1'))

const { PORT = 8080, HOST = '0.0.0.0', NODE_ENV: MODE } = process.env

mongoose
  .connect(databaseUri)
  .then(() => {
    winston.info('Connected to DB')
  })
  .catch(() => {
    winston.error('\n|\n|  Could not connect to DB\n|')
  })

app.use(bodyParser.urlencoded({ limit: '12mb', extended: true }))
app.use(bodyParser.json({ limit: '12mb' }))
app.use(helmet())
app.use(cors())
app.use(hpp())

app.use('/static', express.static(path.resolve('static')))
app.use('/v1', v1)
app.use(webhook)

app.use('/', express.static('dist'))

// Check if we're in development mode to use webpackDevServer middleware
if (MODE === 'development') {
  app.use(require(path.resolve('config/webpackDevServer')))
}

// Send index to all other routes
app.get('*', (req, res) => res.sendFile(path.resolve('dist/index.html')))

// Start server
const server = app.listen(PORT, HOST, () =>
  winston.info(
    `${name} server is listening\n  Port: ${PORT}\n  Host: ${HOST}\n  Mode: ${MODE}`
  )
)

const io = require('socket.io').listen(server)

io.on('connection', socket => {
  socket.on('join', companyId => {
    socket.join(companyId)
    // Emit a refresh to web platform when new camera is connected
    io.to('web-platform').emit('refresh')
  })

  socket.on('disconnect', () => {
    // TODO Emit a refresh to web platform
    io.to('web-platform').emit('refresh')
  })
})

global.io = io
