/* eslint-env node */
const request = require('request')

function slackMessage(body) {
  request({
    url:
      'https://hooks.slack.com/services/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',
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    json: true,
    body
  })
}

module.exports = {
  slackMessage
}
