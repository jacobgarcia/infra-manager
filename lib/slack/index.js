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
