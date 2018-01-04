/* eslint-env node */
const express = require('express')
const path = require('path')
const helmet = require('helmet') // Basic headers protection

const bodyParser = require('body-parser')
const compression = require('compression') // Files compresion
const winston = require('winston') // Logger
const hpp = require('hpp')
const request = require('request')
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
  console.log('Build started...')
  slackMessage({
    text: '*Build started*'
  })

  exec('git pull; yarn; yarn build', (error, stdout, stderr) => {
    if (error) {
      console.log('Error', error)
      slackMessage({
        text: `*Build errored*\nOutput: ${error}`
      })
    }

    if (stdout) {
      console.log('Build succeed')
      exec('yarn restart')
      slackMessage({
        text: `*Build succeed!*\nYou're awersome`
      })
    }

    if (stderr) {
      console.log('Console errors and warnings', stderr)
      slackMessage({
        text: `*Error and warnings:*\n${stderr}`
      })
    }
  })

  res.status(200).json({ message: 'Webhook recieved' })
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
