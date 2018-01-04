/* eslint-env node */
const express = require('express')
const path = require('path')
const helmet = require('helmet') // Basic headers protection

const bodyParser = require('body-parser')
const compression = require('compression') // Files compresion
const winston = require('winston') // Logger
const hpp = require('hpp')
const { exec } = require('child_process')
const app = express()

const webpackDevServer = require(path.resolve('config/webpackDevServer')) // Dev server

const PORT = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())
app.use(hpp())

function shouldCompress(req, res) {
  return req.headers['x-no-compression'] ? false : compression.filter(req, res)
}

// Compression
app.use(compression({filter: shouldCompress}))

// If in development use webpackDevServer
process.env.NODE_ENV === 'development'
&& app.use(webpackDevServer)

// Images and static assets
app.use('/static',
  express.static(path.resolve('static'))
)

// TODO add API


app.post('/webhook', (req, res) => {
  exec('yarn; yarn build', (error, stdout, stderr) => {
    if (error) {
      console.log(error)
    }

    if (stdout) {
      console.log(stdout)
      exec('yarn restart all')
    }

    if (stderr) {
      console.log(stderr)
    }

    return res.status(200).json({ message: 'Webhook recieved' })
  })
})

// Bundles
app.use('/dist',
  express.static('dist')
)

// Send index to all other routes
app.get('*', (req, res) =>
  res.sendFile(path.resolve('src/index.html'))
)

// Start server
app.listen(PORT, () =>
  winston.info(`Connus server is listening on port: ${PORT}!`)
)
