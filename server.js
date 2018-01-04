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


app.post('/webhook', (req, res) => {
  request({
    url: 'https://hooks.slack.com/services/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',
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    json: true,
    body: {
      text: 'Build started...'
    }
  })

  exec('git pull; yarn; yarn build', (error, stdout, stderr) => {
    if (error) {
      request({
        url: 'https://hooks.slack.com/services/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',
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        json: true,
        body: {
          text: `Build failed\nOutput:${error}`
        }
      })
    }

    if (stdout) {
      exec('yarn restart')
      request({
        url: 'https://hooks.slack.com/services/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',
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        json: true,
        body: {
          text: `Build succeed!\nOutput: ${stdout}`
        }
      })
    }

    if (stderr) {
      request({
        url: 'https://hooks.slack.com/services/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',
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },

        body: {
          text: `Build failed\nOutput: ${stderr}`
        }
      })
    }
  })

  return res.status(200).json({ message: 'Webhook recieved' })
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
