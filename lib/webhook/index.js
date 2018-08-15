/* eslint-env node */
const express = require('express')
const router = new express.Router()
const path = require('path')
const { exec } = require('child_process')

const { slackMessage } = require(path.resolve('lib/slack'))

router.post('/webhook-master', (req, res) => {
  slackMessage({
    text: '*Build started. Prepare you motherfucker*'
  })

  exec('git pull', error => {
    if (error) {
      slackMessage({
        text: `*Git error while pulling to this shitty git repository.*\nOutput: ${error}`
      })
      return
    }
    slackMessage({
      text: `*Git succeed!*\nRepository now updated with most recent code version you bastard`
    })

    exec('yarn', (error, stdout) => {
      if (error) {
        slackMessage({
          text: `*Yarn sucks! Error while installing node modules.*\nOutput: ${error}`
        })
        return
      }

      if (stdout) {
        slackMessage({
          text: `*Yarn succeed!*\nRepository now updated with most recent packages faggot`
        })

        exec('yarn build:prod', error => {
          if (error) {
            slackMessage({
              text: `*Yarn build error. Yarn sucks!*\nOutput: ${error}`
            })
            return
          }

          slackMessage({
            text: `*Yarn build succeed!*\nAlmost done bitch!`
          })

          exec('yarn reload:prod', (error, stdout, stderr) => {
            if (error) {
              slackMessage({
                text: `*Yarn reload error. I HATE Yarn TOO MUCH!!*\nOutput: ${error}`
              })
              return
            }

            slackMessage({
              text: `*Build succeed!*\nYou're awersome`
            })

            if (stderr) {
              slackMessage({
                text: `*Errors and warnings:*\n${stderr}`
              })
            }
          })
        })
      }
    })
  })
  res.status(200).json({ message: 'Webhook recieved' })
})

module.exports = router
